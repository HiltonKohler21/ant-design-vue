/* eslint-disable no-param-reassign */

let cached: number;

export default function getScrollBarSize(fresh?: boolean) {
  if (typeof document === 'undefined') {
    return 0;
  }

  if (fresh || cached === undefined) {
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    const outerStyle = outer.style;

    outerStyle.position = 'absolute';
    outerStyle.top = '0';
    outerStyle.left = '0';
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';

    outer.appendChild(inner);

    document.body.appendChild(outer);

    const widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let widthScroll = inner.offsetWidth;

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }

    document.body.removeChild(outer);

    cached = widthContained - widthScroll;
  }
  return cached;
}

function ensureSize(str: string) {
  const match = str.match(/^(.*)px$/);
  const value = Number(match?.[1]);
  return Number.isNaN(value) ? getScrollBarSize() : value;
}

export function getTargetScrollBarSize(target: HTMLElement) {
  if (typeof document === 'undefined' || !target || !(target instanceof Element)) {
    return { width: 0, height: 0 };
  }

  // 目标未挂载到文档、或环境不支持伪元素 getComputedStyle（如 jsdom / 分离节点）时，
  // getComputedStyle 会抛异常，这里安全兜底为 0（后续 ensureSize 会回退到通用测量）。
  try {
    const { width, height } = getComputedStyle(target, '::-webkit-scrollbar');
    return {
      width: ensureSize(width),
      height: ensureSize(height),
    };
  } catch {
    return { width: 0, height: 0 };
  }
}
