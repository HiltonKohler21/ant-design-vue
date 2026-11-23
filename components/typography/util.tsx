import type { CSSProperties, VNodeTypes } from 'vue';
import { createApp } from 'vue';
import { styleToString } from '../vc-util/Dom/css';

interface MeasureResult {
  finished: boolean;
  vNode: VNodeTypes;
}
interface Option {
  rows: number;
  suffix?: string;
}

// We only handle element & text node.
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

let ellipsisContainer: HTMLParagraphElement;

const wrapperStyle: CSSProperties = {
  padding: 0,
  margin: 0,
  display: 'inline',
  lineHeight: 'inherit',
};

function resetDomStyles(target: HTMLElement, origin: HTMLElement, forceNormalWrap = false) {
  target.setAttribute('aria-hidden', 'true');
  const originStyle = window.getComputedStyle(origin);
  const originCSS = styleToString(originStyle);
  // Set shadow
  target.setAttribute('style', originCSS);
  target.style.position = 'fixed';
  target.style.left = '0';
  target.style.top = '-999999px';
  target.style.zIndex = '-1000';
  target.style.display = 'block';
  target.style.boxSizing = 'border-box';

  // Match exact rendered width of origin when available
  const originRect = origin.getBoundingClientRect();
  if (originRect && originRect.width > 0) {
    target.style.width = `${originRect.width}px`;
    target.style.inlineSize = `${originRect.width}px`;
  }
  target.style.minWidth = '0';
  target.style.maxWidth = 'none';
  target.style.minInlineSize = '0';
  target.style.maxInlineSize = 'none';

  // Reset BOTH physical and logical height/padding/border properties
  // (Chromium's getComputedStyle includes `block-size`, `padding-block`, `border-block-width`, etc.)
  target.style.height = 'auto';
  target.style.minHeight = 'auto';
  target.style.maxHeight = 'auto';
  target.style.blockSize = 'auto';
  target.style.minBlockSize = 'auto';
  target.style.maxBlockSize = 'auto';
  target.style.paddingTop = '0';
  target.style.paddingBottom = '0';
  target.style.paddingBlock = '0';
  target.style.borderTopWidth = '0';
  target.style.borderBottomWidth = '0';
  target.style.borderBlockWidth = '0';

  // Clean up css overflow / line-clamp / nowrap
  target.style.overflow = 'visible';
  target.style.overflowX = 'visible';
  target.style.overflowY = 'visible';
  target.style.textOverflow = 'clip';
  const originWhiteSpace = originStyle.whiteSpace;
  if (
    !forceNormalWrap &&
    (originWhiteSpace === 'pre' ||
      originWhiteSpace === 'pre-wrap' ||
      originWhiteSpace === 'pre-line')
  ) {
    target.style.whiteSpace = 'pre-wrap';
  } else {
    target.style.whiteSpace = 'normal';
  }
  (target.style as any).textWrap = 'wrap';
  (target.style as any).webkitLineClamp = 'none';
  (target.style as any).webkitBoxOrient = 'horizontal';
}

function getRealLineHeight(originElement: HTMLElement) {
  const heightContainer = document.createElement('div');
  resetDomStyles(heightContainer, originElement, true);
  heightContainer.appendChild(document.createTextNode('text'));
  document.body.appendChild(heightContainer);
  // The element real height is always less than multiple of line-height
  // Use getBoundingClientRect to get actual single row height of the element
  const realHeight = heightContainer.getBoundingClientRect().height;
  document.body.removeChild(heightContainer);
  return realHeight;
}

/**
 * Check if element has native CSS ellipsis overflow
 */
export function isEleEllipsis(ele: HTMLElement): boolean {
  const childDiv = document.createElement('em');
  ele.appendChild(childDiv);

  if (process.env.NODE_ENV !== 'production') {
    childDiv.className = 'ant-typography-css-ellipsis-content-measure';
  }

  const rect = ele.getBoundingClientRect();
  const childRect = childDiv.getBoundingClientRect();

  ele.removeChild(childDiv);

  const horizontalTolerance = 0.001;

  const isOverflow =
    rect.left - childRect.left > horizontalTolerance ||
    childRect.right - rect.right > horizontalTolerance ||
    rect.top > childRect.top ||
    childRect.bottom > rect.bottom;

  if (isOverflow) {
    return true;
  }

  // Direct `> code` child clips its own text via `.ant-typography-ellipsis-single-line > code`
  const firstChild = ele.firstElementChild as HTMLElement | null;
  if (firstChild && firstChild.tagName === 'CODE') {
    return firstChild.scrollWidth > firstChild.clientWidth;
  }

  return false;
}

export default (
  originElement: HTMLElement,
  option: Option,
  content: string | VNodeTypes[],
  fixedContent: VNodeTypes[],
  ellipsisStr: string,
): {
  content: VNodeTypes;
  text: string;
  ellipsis: boolean;
} => {
  if (!ellipsisContainer) {
    ellipsisContainer = document.createElement('div');
    ellipsisContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ellipsisContainer);
  }

  const { rows, suffix = '' } = option;
  const lineHeight = getRealLineHeight(originElement);
  const maxHeight = Math.round(lineHeight * rows * 100) / 100;

  resetDomStyles(ellipsisContainer, originElement);

  const isArrayContent = Array.isArray(content);
  const contentList: VNodeTypes[] = isArrayContent
    ? (content as VNodeTypes[]).filter(item => item !== '' && item !== null && item !== undefined)
    : [content];

  // Render in the fake container
  const vm = createApp({
    render() {
      return (
        <div style={wrapperStyle}>
          <span style={wrapperStyle}>
            {isArrayContent
              ? contentList.map((item, idx) =>
                  typeof item === 'string' || typeof item === 'number' ? (
                    item
                  ) : (
                    <span key={idx} style={wrapperStyle}>
                      {item}
                    </span>
                  ),
                )
              : content}
          </span>
          {suffix ? <span style={wrapperStyle}>{suffix}</span> : null}
          <span style={wrapperStyle}>{fixedContent}</span>
        </div>
      );
    },
  });

  vm.mount(ellipsisContainer);

  // Check if ellipsis in measure div is height enough for content
  function inRange() {
    const currentHeight = Math.round(ellipsisContainer.getBoundingClientRect().height * 100) / 100;
    return currentHeight - 0.1 <= maxHeight; // -.1 for firefox
  }

  // Skip ellipsis if already match
  if (inRange()) {
    const htmlText = ellipsisContainer.innerHTML;
    vm.unmount();
    return { content, text: htmlText, ellipsis: false };
  }

  const wrapperNode = ellipsisContainer.childNodes[0];
  const contentSpan = wrapperNode?.childNodes[0];
  const fixedSpan = wrapperNode?.lastChild;
  const childNodes: ChildNode[] = contentSpan
    ? Array.prototype.slice
        .apply(contentSpan.cloneNode(true).childNodes)
        .filter(({ nodeType, data }: any) => nodeType !== COMMENT_NODE && data !== '')
    : [];
  const fixedNodes: ChildNode[] = fixedSpan
    ? Array.prototype.slice.apply(fixedSpan.cloneNode(true).childNodes)
    : [];

  vm.unmount();

  // ========================= Find match ellipsis content =========================
  const ellipsisChildren: VNodeTypes[] = [];
  ellipsisContainer.innerHTML = '';

  // Create origin content holder
  const ellipsisContentHolder = document.createElement('span');
  ellipsisContainer.appendChild(ellipsisContentHolder);
  const ellipsisTextNode = document.createTextNode(ellipsisStr + suffix);
  ellipsisContentHolder.appendChild(ellipsisTextNode);

  fixedNodes.forEach(childNode => {
    ellipsisContainer.appendChild(childNode);
  });

  // Append before fixed nodes
  function appendChildNode(node: ChildNode) {
    ellipsisContentHolder.insertBefore(node, ellipsisTextNode);
  }

  // Get maximum text
  function measureText(
    textNode: Text,
    fullText: string,
    startLoc = 0,
    endLoc = fullText.length,
    lastSuccessLoc = 0,
  ): MeasureResult {
    const midLoc = Math.floor((startLoc + endLoc) / 2);
    const currentText = fullText.slice(0, midLoc);
    textNode.textContent = currentText;

    if (startLoc >= endLoc - 1) {
      // Loop when step is small
      for (let step = endLoc; step >= startLoc; step -= 1) {
        const currentStepText = fullText.slice(0, step);
        textNode.textContent = currentStepText;

        if (inRange() || !currentStepText) {
          return step === fullText.length
            ? {
                finished: false,
                vNode: fullText,
              }
            : {
                finished: true,
                vNode: currentStepText,
              };
        }
      }
    }

    if (inRange()) {
      return measureText(textNode, fullText, midLoc, endLoc, midLoc);
    }
    return measureText(textNode, fullText, startLoc, midLoc, lastSuccessLoc);
  }

  function measureNode(childNode: ChildNode, index: number): MeasureResult {
    const type = childNode.nodeType;
    if (type === ELEMENT_NODE) {
      // We don't split element, it will keep if whole element can be displayed.
      appendChildNode(childNode);
      if (inRange()) {
        return {
          finished: false,
          vNode: contentList[index],
        };
      }

      // Clean up if can not pull in
      ellipsisContentHolder.removeChild(childNode);
      return {
        finished: true,
        vNode: null,
      };
    }
    if (type === TEXT_NODE) {
      const fullText = childNode.textContent || '';
      const textNode = document.createTextNode(fullText);
      appendChildNode(textNode);
      return measureText(textNode, fullText);
    }

    // Not handle other type of content
    return {
      finished: false,
      vNode: null,
    };
  }

  childNodes.some((childNode, index) => {
    const { finished, vNode } = measureNode(childNode, index);
    if (vNode) {
      ellipsisChildren.push(vNode);
    }
    return finished;
  });

  return {
    content: ellipsisChildren,
    text: ellipsisContainer.innerHTML,
    ellipsis: true,
  };
};
