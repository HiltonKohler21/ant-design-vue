const INTERACTIVE_SELECTOR = [
  '.ant-btn:not([disabled]):not(.ant-btn-disabled)',
  '.ant-switch:not([disabled]):not(.ant-switch-disabled)',
  '.ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled)',
  '.ant-radio-wrapper:not(.ant-radio-wrapper-disabled)',
  '.ant-radio-button-wrapper:not(.ant-radio-button-wrapper-disabled)',
  '.ant-tag-checkable',
].join(',');

const DEFAULT_PALETTE = [
  '#1677ff',
  '#52c41a',
  '#faad14',
  '#eb2f96',
  '#722ed1',
  '#13c2c2',
  '#ff4d4f',
];

function spawnSparkleBurst(originX: number, originY: number) {
  if (typeof document === 'undefined') return;
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const primaryColor =
    getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() ||
    '#1677ff';
  const palette = [primaryColor, ...DEFAULT_PALETTE];

  const container = document.createElement('div');
  container.className = 'happy-work-burst-container';
  container.setAttribute('aria-hidden', 'true');
  Object.assign(container.style, {
    position: 'fixed',
    left: `${originX}px`,
    top: `${originY}px`,
    width: '0px',
    height: '0px',
    pointerEvents: 'none',
    zIndex: '9999',
    overflow: 'visible',
  });

  const particleCount = 14;
  let completed = 0;
  let cleaned = false;

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    container.remove();
  };

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.38;
    const distance = 22 + Math.random() * 28;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 8;
    const size = 4 + Math.random() * 4;
    const color = palette[i % palette.length];
    const isCircle = i % 3 === 0;
    const isPill = i % 3 === 1;

    Object.assign(particle.style, {
      position: 'absolute',
      left: `${-size / 2}px`,
      top: `${-size / 2}px`,
      width: `${isPill ? size * 1.45 : size}px`,
      height: `${isPill ? size * 0.65 : size}px`,
      borderRadius: isCircle ? '50%' : isPill ? '999px' : '2px',
      backgroundColor: color,
      willChange: 'transform, opacity',
    });

    container.appendChild(particle);

    const rotStart = Math.round(Math.random() * 180);
    const rotEnd = rotStart + (Math.random() > 0.5 ? 180 : -180);

    if (typeof particle.animate === 'function') {
      const anim = particle.animate(
        [
          {
            transform: `translate3d(0, 0, 0) scale(0.4) rotate(${rotStart}deg)`,
            opacity: 1,
          },
          {
            transform: `translate3d(${tx * 0.72}px, ${ty * 0.72}px, 0) scale(1.1) rotate(${
              (rotStart + rotEnd) / 2
            }deg)`,
            opacity: 0.95,
            offset: 0.45,
          },
          {
            transform: `translate3d(${tx}px, ${ty + 12}px, 0) scale(0.15) rotate(${rotEnd}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 560 + Math.random() * 160,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        },
      );
      anim.onfinish = () => {
        completed += 1;
        if (completed >= particleCount) {
          cleanup();
        }
      };
    }
  }

  document.body.appendChild(container);
  // Guarantee cleanup even if Web Animations API is unavailable or interrupted
  window.setTimeout(cleanup, 900);
}

export function installHappyWorkEffect(): () => void {
  if (typeof document === 'undefined') {
    return () => {};
  }

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target || typeof target.closest !== 'function') return;
    const interactiveEl = target.closest(INTERACTIVE_SELECTOR) as HTMLElement | null;
    if (!interactiveEl) return;

    const rect = interactiveEl.getBoundingClientRect();
    const x =
      event.clientX > 0 && event.clientX >= rect.left && event.clientX <= rect.right
        ? event.clientX
        : rect.left + rect.width / 2;
    const y =
      event.clientY > 0 && event.clientY >= rect.top && event.clientY <= rect.bottom
        ? event.clientY
        : rect.top + rect.height / 2;

    spawnSparkleBurst(x, y);
  };

  document.addEventListener('click', handleClick, { passive: true });
  return () => {
    document.removeEventListener('click', handleClick);
  };
}
