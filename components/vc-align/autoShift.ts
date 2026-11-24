import type { AlignResult, AlignType } from './interface';

interface RectLike {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

const OVERFLOW_CLIP_REGEX = /(auto|scroll|overlay|hidden|clip)/;
const ARROW_MIN_MARGIN = 18;
const ARROW_STYLE_KEYS_MAP = new WeakMap<HTMLElement, Set<'left' | 'right' | 'top' | 'bottom'>>();

function convertOffsetValue(val: number | string | undefined, size: number): number {
  if (typeof val === 'number') {
    return Number.isFinite(val) ? val : 0;
  }
  if (typeof val === 'string') {
    if (val.endsWith('%')) {
      const parsed = parseFloat(val.slice(0, -1));
      return Number.isFinite(parsed) ? (parsed / 100) * size : 0;
    }
    const parsed = parseFloat(val);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeOffset(
  offset: (number | string)[] | undefined,
  size: { width: number; height: number },
): [number, number] {
  return [
    convertOffsetValue(offset?.[0], size.width),
    convertOffsetValue(offset?.[1], size.height),
  ];
}

function getAnchorOffset(
  rect: { left: number; top: number; width: number; height: number },
  point: string,
) {
  const v = point.charAt(0);
  const h = point.charAt(1);
  let left = rect.left;
  let top = rect.top;
  if (v === 'c') {
    top += rect.height / 2;
  } else if (v === 'b') {
    top += rect.height;
  }
  if (h === 'c') {
    left += rect.width / 2;
  } else if (h === 'r') {
    left += rect.width;
  }
  return { left, top };
}

function computeAlignedPos(
  sourceSize: { width: number; height: number },
  targetRect: { left: number; top: number; width: number; height: number },
  points: string[],
  offset: [number, number],
  targetOffset: [number, number],
) {
  const targetAnchor = getAnchorOffset(targetRect, points[1]);
  const sourceAnchor = getAnchorOffset(
    { left: 0, top: 0, width: sourceSize.width, height: sourceSize.height },
    points[0],
  );
  return {
    left: targetAnchor.left - sourceAnchor.left + offset[0] - targetOffset[0],
    top: targetAnchor.top - sourceAnchor.top + offset[1] - targetOffset[1],
  };
}

function flipAxisPoints(points: string[], regex: RegExp, map: Record<string, string>): string[] {
  return points.map(p => p.replace(regex, ch => map[ch] || ch));
}

function getVisibleClipRect(
  target: HTMLElement,
  source: HTMLElement,
  alwaysByViewport: boolean | undefined,
): RectLike | null {
  const doc = target.ownerDocument || document;
  const win = doc.defaultView || window;
  const docEl = doc.documentElement;
  const body = doc.body;

  const viewportWidth = docEl.clientWidth || win.innerWidth || 0;
  const viewportHeight = docEl.clientHeight || win.innerHeight || 0;

  let left = alwaysByViewport === false ? -Infinity : 0;
  let top = alwaysByViewport === false ? -Infinity : 0;
  let right = alwaysByViewport === false ? Infinity : viewportWidth;
  let bottom = alwaysByViewport === false ? Infinity : viewportHeight;

  const visited = new Set<HTMLElement>();
  const intersectAncestors = (startEl: HTMLElement | null) => {
    let cur = startEl?.parentElement || null;
    while (cur && cur !== body && cur !== docEl) {
      if (!visited.has(cur) && cur.nodeType === 1) {
        visited.add(cur);
        let overflowX = cur.style?.overflowX || cur.style?.overflow || '';
        let overflowY = cur.style?.overflowY || cur.style?.overflow || '';
        try {
          const style = win.getComputedStyle(cur);
          overflowX = style.overflowX || style.overflow;
          overflowY = style.overflowY || style.overflow;
        } catch {
          // Ignore jsdom / nwsapi getComputedStyle errors on detached nodes or unsupported selectors
        }
        const clipX = OVERFLOW_CLIP_REGEX.test(overflowX);
        const clipY = OVERFLOW_CLIP_REGEX.test(overflowY);
        if (clipX || clipY) {
          const rect = cur.getBoundingClientRect();
          const innerWidth = cur.clientWidth > 0 ? cur.clientWidth : rect.width;
          const innerHeight = cur.clientHeight > 0 ? cur.clientHeight : rect.height;
          if (clipX && innerWidth > 0) {
            left = Math.max(left, rect.left + cur.clientLeft);
            right = Math.min(right, rect.left + cur.clientLeft + innerWidth);
          }
          if (clipY && innerHeight > 0) {
            top = Math.max(top, rect.top + cur.clientTop);
            bottom = Math.min(bottom, rect.top + cur.clientTop + innerHeight);
          }
        }
      }
      cur = cur.parentElement;
    }
  };

  intersectAncestors(target);
  intersectAncestors(source);

  if (!Number.isFinite(left)) left = 0;
  if (!Number.isFinite(top)) top = 0;
  if (!Number.isFinite(right)) right = viewportWidth;
  if (!Number.isFinite(bottom)) bottom = viewportHeight;

  if (right <= left || bottom <= top) {
    return null;
  }

  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

function findArrowElement(source: HTMLElement): HTMLElement | null {
  let container: HTMLElement = source;
  for (let i = 0; i < source.children.length; i += 1) {
    const child = source.children[i];
    if (
      child instanceof HTMLElement &&
      Array.from(child.classList).some(cls => cls.endsWith('-content'))
    ) {
      container = child;
      break;
    }
  }
  for (let i = 0; i < container.children.length; i += 1) {
    const child = container.children[i];
    if (
      child instanceof HTMLElement &&
      Array.from(child.classList).some(cls => cls.endsWith('-arrow'))
    ) {
      return child;
    }
  }
  return null;
}

function resetArrowStyle(arrowEl: HTMLElement | null) {
  if (!arrowEl) return;
  const touched = ARROW_STYLE_KEYS_MAP.get(arrowEl);
  if (!touched || touched.size === 0) return;
  touched.forEach(key => {
    arrowEl.style[key] = '';
  });
  touched.clear();
}

function setArrowStyleProp(
  arrowEl: HTMLElement,
  key: 'left' | 'right' | 'top' | 'bottom',
  value: string,
) {
  let touched = ARROW_STYLE_KEYS_MAP.get(arrowEl);
  if (!touched) {
    touched = new Set();
    ARROW_STYLE_KEYS_MAP.set(arrowEl, touched);
  }
  arrowEl.style[key] = value;
  touched.add(key);
}

function clearArrowStyleProp(arrowEl: HTMLElement, key: 'left' | 'right' | 'top' | 'bottom') {
  const touched = ARROW_STYLE_KEYS_MAP.get(arrowEl);
  if (touched?.has(key)) {
    arrowEl.style[key] = '';
    touched.delete(key);
  }
}

function shiftSourceByDelta(source: HTMLElement, deltaX: number, deltaY: number, align: AlignType) {
  if (align.useCssTransform) {
    return;
  }
  const win = source.ownerDocument?.defaultView || window;
  if (Math.abs(deltaX) >= 1) {
    if (align.useCssRight) {
      const cur = parseFloat(source.style.right || win.getComputedStyle(source).right) || 0;
      source.style.right = `${cur - deltaX}px`;
    } else {
      const cur = parseFloat(source.style.left || win.getComputedStyle(source).left) || 0;
      source.style.left = `${cur + deltaX}px`;
    }
  }
  if (Math.abs(deltaY) >= 1) {
    if (align.useCssBottom) {
      const cur = parseFloat(source.style.bottom || win.getComputedStyle(source).bottom) || 0;
      source.style.bottom = `${cur - deltaY}px`;
    } else {
      const cur = parseFloat(source.style.top || win.getComputedStyle(source).top) || 0;
      source.style.top = `${cur + deltaY}px`;
    }
  }
}

function clampCrossAxis(
  desired: number,
  sourceLen: number,
  visibleStart: number,
  visibleEnd: number,
  targetStart: number,
  targetEnd: number,
  arrowMargin: number,
): number {
  const minPos = visibleStart;
  const maxPos = visibleEnd - sourceLen;

  if (maxPos < minPos) {
    return Math.max(maxPos, Math.min(minPos, desired));
  }

  const targetLen = targetEnd - targetStart;
  const inset = Math.min(arrowMargin, targetLen / 2);

  if (desired < minPos) {
    const limitEnd = targetEnd - inset;
    return Math.max(desired, Math.min(minPos, limitEnd));
  }
  if (desired > maxPos) {
    const limitStart = targetStart + inset - sourceLen;
    return Math.min(desired, Math.max(maxPos, limitStart));
  }
  return desired;
}

function isRectCompletelyOutside(
  left: number,
  top: number,
  width: number,
  height: number,
  clip: RectLike,
): boolean {
  return (
    left + width <= clip.left ||
    left >= clip.right ||
    top + height <= clip.top ||
    top >= clip.bottom
  );
}

export function shouldUseAutoShift(align: AlignType | undefined): align is AlignType {
  const overflow = align?.overflow as
    | (AlignType['overflow'] & { resizeWidth?: boolean; resizeHeight?: boolean })
    | undefined;
  return !!(
    align?.points &&
    align.points.length >= 2 &&
    !align.useCssTransform &&
    !overflow?.resizeWidth &&
    !overflow?.resizeHeight &&
    (overflow?.adjustX || overflow?.adjustY || overflow?.shiftX || overflow?.shiftY)
  );
}

/**
 * Post-align refinement on top of `dom-align`:
 * 1. Measures un-squished popup dimensions (guarding against CSS right-edge shrink-to-fit).
 * 2. Computes the true visible clip rect (browser viewport intersected with scrollable ancestors).
 * 3. Flips primary axis (`top <-> bottom` / `left <-> right`) first toward the side with less overflow.
 * 4. Smoothly clamps/shifts ONLY along the cross axis (never overlapping the trigger along the primary
 *    stacking axis), releasing continuously so the popup scrolls out cleanly with its target.
 * 5. Dynamically tracks `.ant-*-arrow` toward the target center when shifted, and resets inline
 *    arrow styles whenever unshifted.
 */
export function applyAutoShift(
  source: HTMLElement,
  target: HTMLElement,
  align: AlignType | undefined,
  result: AlignResult,
): AlignResult {
  const arrowEl = findArrowElement(source);
  const overflow = align?.overflow;
  const canAdjustX = !!(overflow?.adjustX || overflow?.shiftX);
  const canAdjustY = !!(overflow?.adjustY || overflow?.shiftY);

  if (!align?.points || align.points.length < 2 || (!canAdjustX && !canAdjustY)) {
    resetArrowStyle(arrowEl);
    return result;
  }

  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  if (
    (sourceRect.width === 0 && sourceRect.height === 0) ||
    (targetRect.width === 0 && targetRect.height === 0)
  ) {
    resetArrowStyle(arrowEl);
    return result;
  }

  // Guard against CSS shrink-to-fit squishing when an absolutely positioned popup
  // is currently placed near the right edge of its containing block.
  let sourceSize = { width: sourceRect.width, height: sourceRect.height };
  let wasUnsquished = false;
  if (!align.useCssTransform && !align.useCssRight) {
    const doc = source.ownerDocument || document;
    const win = doc.defaultView || window;
    const offsetParent = source.offsetParent as HTMLElement | null;
    const parentRight = offsetParent
      ? offsetParent.getBoundingClientRect().right
      : doc.documentElement?.clientWidth || win.innerWidth || 0;
    if (parentRight > 0 && sourceRect.right >= parentRight - 2) {
      const prevLeft = source.style.left;
      if (prevLeft !== '0px') {
        source.style.left = '0px';
        const probeRect = source.getBoundingClientRect();
        source.style.left = prevLeft;
        if (probeRect.width > sourceRect.width + 0.5) {
          sourceSize = { width: probeRect.width, height: probeRect.height };
          wasUnsquished = true;
        }
      }
    }
  }

  const origPoints = [align.points[0], align.points[1]];
  const origOffset = normalizeOffset(align.offset as (number | string)[] | undefined, sourceSize);
  const origTargetOffset = normalizeOffset(align.targetOffset as (number | string)[] | undefined, {
    width: targetRect.width,
    height: targetRect.height,
  });

  const visibleRect = getVisibleClipRect(target, source, overflow?.alwaysByViewport);
  const basePos = computeAlignedPos(
    sourceSize,
    targetRect,
    origPoints,
    origOffset,
    origTargetOffset,
  );

  if (!visibleRect) {
    const deltaX = Math.round(basePos.left - sourceRect.left);
    const deltaY = Math.round(basePos.top - sourceRect.top);
    shiftSourceByDelta(source, deltaX, deltaY, align);
    resetArrowStyle(arrowEl);
    return {
      ...result,
      points: origPoints,
      offset: origOffset,
      targetOffset: origTargetOffset,
      overflow: {
        adjustX: false,
        adjustY: false,
      },
    };
  }

  const isTargetVisible =
    targetRect.right > visibleRect.left &&
    targetRect.left < visibleRect.right &&
    targetRect.bottom > visibleRect.top &&
    targetRect.top < visibleRect.bottom;

  // Step 1: Independent vertical & horizontal flip towards the side with strictly less overflow
  let finalPoints = [...origPoints];
  const finalOffset: [number, number] = [...origOffset];
  const finalTargetOffset: [number, number] = [...origTargetOffset];

  if (canAdjustY) {
    const origOverflowY =
      Math.max(0, visibleRect.top - basePos.top) +
      Math.max(0, basePos.top + sourceSize.height - visibleRect.bottom);
    if (origOverflowY > 0.5) {
      const flippedPointsY = flipAxisPoints(origPoints, /[tb]/gi, { t: 'b', b: 't' });
      if (flippedPointsY[0] !== origPoints[0] || flippedPointsY[1] !== origPoints[1]) {
        const flippedOffsetY: [number, number] = [origOffset[0], -origOffset[1]];
        const flippedTargetOffsetY: [number, number] = [origTargetOffset[0], -origTargetOffset[1]];
        const flippedPosY = computeAlignedPos(
          sourceSize,
          targetRect,
          flippedPointsY,
          flippedOffsetY,
          flippedTargetOffsetY,
        );
        const flippedOverflowY =
          Math.max(0, visibleRect.top - flippedPosY.top) +
          Math.max(0, flippedPosY.top + sourceSize.height - visibleRect.bottom);
        if (flippedOverflowY < origOverflowY - 0.5) {
          finalPoints = flipAxisPoints(finalPoints, /[tb]/gi, { t: 'b', b: 't' });
          finalOffset[1] = -finalOffset[1];
          finalTargetOffset[1] = -finalTargetOffset[1];
        }
      }
    }
  }

  if (canAdjustX) {
    const origOverflowX =
      Math.max(0, visibleRect.left - basePos.left) +
      Math.max(0, basePos.left + sourceSize.width - visibleRect.right);
    if (origOverflowX > 0.5) {
      const flippedPointsX = flipAxisPoints(origPoints, /[lr]/gi, { l: 'r', r: 'l' });
      if (flippedPointsX[0] !== origPoints[0] || flippedPointsX[1] !== origPoints[1]) {
        const flippedOffsetX: [number, number] = [-origOffset[0], origOffset[1]];
        const flippedTargetOffsetX: [number, number] = [-origTargetOffset[0], origTargetOffset[1]];
        const flippedPosX = computeAlignedPos(
          sourceSize,
          targetRect,
          flippedPointsX,
          flippedOffsetX,
          flippedTargetOffsetX,
        );
        const flippedOverflowX =
          Math.max(0, visibleRect.left - flippedPosX.left) +
          Math.max(0, flippedPosX.left + sourceSize.width - visibleRect.right);
        if (flippedOverflowX < origOverflowX - 0.5) {
          finalPoints = flipAxisPoints(finalPoints, /[lr]/gi, { l: 'r', r: 'l' });
          finalOffset[0] = -finalOffset[0];
          finalTargetOffset[0] = -finalTargetOffset[0];
        }
      }
    }
  }

  const desiredPos = computeAlignedPos(
    sourceSize,
    targetRect,
    finalPoints,
    finalOffset,
    finalTargetOffset,
  );

  // Determine placement stacking axis:
  // top*/bottom* -> vertical primary axis, horizontal cross-axis
  // left*/right* -> horizontal primary axis, vertical cross-axis
  const v0 = finalPoints[0].charAt(0);
  const v1 = finalPoints[1].charAt(0);
  const h0 = finalPoints[0].charAt(1);
  const h1 = finalPoints[1].charAt(1);
  const isVerticalPlacement = (v0 === 'b' && v1 === 't') || (v0 === 't' && v1 === 'b');
  const isHorizontalPlacement = (h0 === 'r' && h1 === 'l') || (h0 === 'l' && h1 === 'r');

  const arrowWidth = arrowEl?.offsetWidth || 16;
  const arrowHeight = arrowEl?.offsetHeight || 16;
  const arrowMarginX = Math.min(
    sourceSize.width / 2,
    Math.max(arrowWidth / 2 + 10, ARROW_MIN_MARGIN),
  );
  const arrowMarginY = Math.min(
    sourceSize.height / 2,
    Math.max(arrowHeight / 2 + 10, ARROW_MIN_MARGIN),
  );

  // Step 2: Smooth cross-axis edge shift with continuous scroll-out release.
  // Never clamp along the primary stacking axis so a top/bottom popup never overlaps
  // its trigger vertically and a left/right popup never overlaps its trigger horizontally.
  let finalLeft = desiredPos.left;
  let finalTop = desiredPos.top;

  if (canAdjustX && !isHorizontalPlacement) {
    finalLeft = clampCrossAxis(
      desiredPos.left,
      sourceSize.width,
      visibleRect.left,
      visibleRect.right,
      targetRect.left,
      targetRect.right,
      arrowMarginX,
    );
  }

  if (canAdjustY && !isVerticalPlacement) {
    finalTop = clampCrossAxis(
      desiredPos.top,
      sourceSize.height,
      visibleRect.top,
      visibleRect.bottom,
      targetRect.top,
      targetRect.bottom,
      arrowMarginY,
    );
  }

  // Once the target, the shifted/flipped popup, AND the natural popup are ALL completely
  // outside the visible clip rect, cleanly reset back to the original un-flipped placement
  // offscreen without causing any visible jump.
  if (
    !isTargetVisible &&
    isRectCompletelyOutside(
      finalLeft,
      finalTop,
      sourceSize.width,
      sourceSize.height,
      visibleRect,
    ) &&
    isRectCompletelyOutside(
      basePos.left,
      basePos.top,
      sourceSize.width,
      sourceSize.height,
      visibleRect,
    )
  ) {
    const deltaX = Math.round(basePos.left - sourceRect.left);
    const deltaY = Math.round(basePos.top - sourceRect.top);
    shiftSourceByDelta(source, deltaX, deltaY, align);
    resetArrowStyle(arrowEl);
    return {
      ...result,
      points: origPoints,
      offset: origOffset,
      targetOffset: origTargetOffset,
      overflow: {
        adjustX: false,
        adjustY: false,
      },
    };
  }

  // Read arrow offsetParent geometry BEFORE mutating source styles to avoid extra forced reflow
  // (re-measure after shift only in the rare un-squished case so contentWidth is accurate).
  const arrowParent = (arrowEl?.offsetParent as HTMLElement | null) || source;
  let arrowParentRect =
    arrowEl && !wasUnsquished ? arrowParent.getBoundingClientRect() : sourceRect;
  let contentOffsetX = wasUnsquished ? 0 : arrowParentRect.left - sourceRect.left;
  let contentOffsetY = wasUnsquished ? 0 : arrowParentRect.top - sourceRect.top;
  let contentWidth = wasUnsquished ? sourceSize.width : arrowParentRect.width || sourceSize.width;
  let contentHeight = wasUnsquished
    ? sourceSize.height
    : arrowParentRect.height || sourceSize.height;

  const deltaX = Math.round(finalLeft - sourceRect.left);
  const deltaY = Math.round(finalTop - sourceRect.top);
  shiftSourceByDelta(source, deltaX, deltaY, align);

  if (arrowEl && wasUnsquished) {
    const shiftedSourceRect = source.getBoundingClientRect();
    arrowParentRect = arrowParent.getBoundingClientRect();
    contentOffsetX = arrowParentRect.left - shiftedSourceRect.left;
    contentOffsetY = arrowParentRect.top - shiftedSourceRect.top;
    contentWidth = arrowParentRect.width || sourceSize.width;
    contentHeight = arrowParentRect.height || sourceSize.height;
  }

  const shiftedX = Math.abs(finalLeft - desiredPos.left) > 0.5;
  const shiftedY = Math.abs(finalTop - desiredPos.top) > 0.5;

  // Step 3: Dynamic arrow tracking along the shifted cross-axis
  if (arrowEl) {
    if (isVerticalPlacement && shiftedX) {
      clearArrowStyleProp(arrowEl, 'top');
      clearArrowStyleProp(arrowEl, 'bottom');
      const newContentLeft = finalLeft + contentOffsetX;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const margin = Math.min(contentWidth / 2, Math.max(arrowWidth / 2 + 10, ARROW_MIN_MARGIN));
      const arrowCenterX = Math.max(
        margin,
        Math.min(contentWidth - margin, targetCenterX - newContentLeft),
      );
      if (h0 === 'c') {
        // Centered placements (`top` / `bottom`) have CSS `transform: translateX(-50%) ...`
        setArrowStyleProp(arrowEl, 'left', `${Math.round(arrowCenterX)}px`);
        clearArrowStyleProp(arrowEl, 'right');
      } else {
        setArrowStyleProp(arrowEl, 'left', `${Math.round(arrowCenterX - arrowWidth / 2)}px`);
        setArrowStyleProp(arrowEl, 'right', 'auto');
      }
    } else if (isHorizontalPlacement && shiftedY) {
      clearArrowStyleProp(arrowEl, 'left');
      clearArrowStyleProp(arrowEl, 'right');
      const newContentTop = finalTop + contentOffsetY;
      const targetCenterY = targetRect.top + targetRect.height / 2;
      const margin = Math.min(contentHeight / 2, Math.max(arrowHeight / 2 + 10, ARROW_MIN_MARGIN));
      const arrowCenterY = Math.max(
        margin,
        Math.min(contentHeight - margin, targetCenterY - newContentTop),
      );
      if (v0 === 'c') {
        // Centered placements (`left` / `right`) have CSS `transform: translateY(-50%) ...`
        setArrowStyleProp(arrowEl, 'top', `${Math.round(arrowCenterY)}px`);
        clearArrowStyleProp(arrowEl, 'bottom');
      } else {
        setArrowStyleProp(arrowEl, 'top', `${Math.round(arrowCenterY - arrowHeight / 2)}px`);
        setArrowStyleProp(arrowEl, 'bottom', 'auto');
      }
    } else {
      resetArrowStyle(arrowEl);
    }
  }

  return {
    ...result,
    points: finalPoints,
    offset: finalOffset,
    targetOffset: finalTargetOffset,
    overflow: {
      adjustX: shiftedX || !!result.overflow?.adjustX,
      adjustY: shiftedY || !!result.overflow?.adjustY,
    },
  };
}
