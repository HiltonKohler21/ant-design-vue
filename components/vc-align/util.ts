import contains from '../vc-util/Dom/contains';
import type { TargetPoint } from './interface';
import ResizeObserver from 'resize-observer-polyfill';

export function isSamePoint(prev: TargetPoint, next: TargetPoint) {
  if (prev === next) return true;
  if (!prev || !next) return false;

  if ('pageX' in next && 'pageY' in next) {
    return prev.pageX === next.pageX && prev.pageY === next.pageY;
  }

  if ('clientX' in next && 'clientY' in next) {
    return prev.clientX === next.clientX && prev.clientY === next.clientY;
  }

  return false;
}

export function restoreFocus(activeElement, container) {
  // Focus back if is in the container
  if (
    activeElement !== document.activeElement &&
    contains(container, activeElement) &&
    typeof activeElement.focus === 'function'
  ) {
    activeElement.focus();
  }
}

export function monitorResize(element: HTMLElement, callback: Function) {
  let prevWidth: number = null;
  let prevHeight: number = null;

  function onResize([{ target }]: ResizeObserverEntry[]) {
    if (!document.documentElement.contains(target)) return;
    const { width, height } = target.getBoundingClientRect();
    const fixedWidth = Math.floor(width);
    const fixedHeight = Math.floor(height);

    if (prevWidth !== fixedWidth || prevHeight !== fixedHeight) {
      // https://webkit.org/blog/9997/resizeobserver-in-webkit/
      Promise.resolve().then(() => {
        callback({ width: fixedWidth, height: fixedHeight });
      });
    }

    prevWidth = fixedWidth;
    prevHeight = fixedHeight;
  }

  const resizeObserver = new ResizeObserver(onResize);
  if (element) {
    resizeObserver.observe(element);
  }

  return () => {
    resizeObserver.disconnect();
  };
}

const SCROLLABLE_OVERFLOW_REGEX = /(auto|scroll|overlay|hidden)/;

export function getScrollableAncestors(element: HTMLElement | null): EventTarget[] {
  const targets: EventTarget[] = [];
  if (typeof window === 'undefined') {
    return targets;
  }
  const seen = new Set<EventTarget>();
  const doc = element?.ownerDocument || document;
  const win = doc.defaultView || window;
  const body = doc.body;
  const docEl = doc.documentElement;

  let current: HTMLElement | null = element?.parentElement || null;
  while (current && current !== body && current !== docEl) {
    if (current.nodeType === 1) {
      let overflow = `${current.style?.overflow || ''}${current.style?.overflowX || ''}${
        current.style?.overflowY || ''
      }`;
      try {
        const style = win.getComputedStyle(current);
        overflow = `${style.overflow}${style.overflowX}${style.overflowY}`;
      } catch {
        // Ignore jsdom / nwsapi getComputedStyle errors on detached nodes or unsupported selectors
      }
      if (SCROLLABLE_OVERFLOW_REGEX.test(overflow) && !seen.has(current)) {
        seen.add(current);
        targets.push(current);
      }
    }
    current = current.parentElement;
  }

  if (!seen.has(win)) {
    seen.add(win);
    targets.push(win);
  }
  return targets;
}
