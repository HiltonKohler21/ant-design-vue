<docs>
---
order: 18
title:
  zh-CN: 自定义按钮波纹
  en-US: Custom Wave
---

## zh-CN

波纹效果带来了灵动性，可以通过 `ConfigProvider` 的 `wave.showEffect` 自定义动态波纹效果，或设置 `wave.disabled` 关闭波纹。

## en-US

Wave effect brings dynamic feedback. You can customize dynamic wave effects through `wave.showEffect` in `ConfigProvider`, or disable it with `wave.disabled`.
</docs>

<template>
  <a-flex gap="large" wrap="wrap">
    <a-config-provider :wave="{ disabled: true }">
      <a-button type="primary">Disabled</a-button>
    </a-config-provider>
    <a-config-provider>
      <a-button type="primary">Default</a-button>
    </a-config-provider>
    <a-config-provider :wave="{ showEffect: showInsetEffect }">
      <a-button type="primary">Inset</a-button>
    </a-config-provider>
    <a-config-provider :wave="{ showEffect: showShakeEffect }">
      <a-button type="primary">Shake</a-button>
    </a-config-provider>
    <a-config-provider :wave="{ showEffect: showHappyEffect }">
      <a-button type="primary">Happy Work</a-button>
    </a-config-provider>
  </a-flex>
</template>

<script lang="ts" setup>
type WaveShowEffect = (node: HTMLElement, info: { event: MouseEvent; component?: string }) => void;

// Prepare effect holder
const createHolder = (node: HTMLElement) => {
  const { borderWidth } = getComputedStyle(node);
  const borderWidthNum = Number.parseInt(borderWidth, 10) || 0;

  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.inset = `-${borderWidthNum}px`;
  div.style.borderRadius = 'inherit';
  div.style.background = 'transparent';
  div.style.zIndex = '999';
  div.style.pointerEvents = 'none';
  div.style.overflow = 'hidden';
  node.appendChild(div);

  return div;
};

const createDot = (holder: HTMLElement, color: string, left: number, top: number, size = 0) => {
  const dot = document.createElement('div');
  dot.style.position = 'absolute';
  dot.style.insetInlineStart = `${left}px`;
  dot.style.top = `${top}px`;
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;
  dot.style.borderRadius = '50%';
  dot.style.background = color;
  dot.style.transform = 'translate3d(-50%, -50%, 0)';
  dot.style.transition = 'all 1s ease-out';
  holder.appendChild(dot);
  return dot;
};

// Inset Effect
const showInsetEffect: WaveShowEffect = (node, { event, component }) => {
  if (component !== 'Button') {
    return;
  }

  const holder = createHolder(node);
  const rect = holder.getBoundingClientRect();
  const left = event.clientX - rect.left;
  const top = event.clientY - rect.top;
  const dot = createDot(holder, 'rgba(255, 255, 255, 0.65)', left, top);

  requestAnimationFrame(() => {
    const cleanup = () => holder.remove();
    dot.ontransitionend = cleanup;
    setTimeout(cleanup, 1100);

    dot.style.width = '200px';
    dot.style.height = '200px';
    dot.style.opacity = '0';
  });
};

// Shake Effect
const showShakeEffect: WaveShowEffect = (node, { component }) => {
  if (component !== 'Button') {
    return;
  }

  const seq = [0, -15, 15, -5, 5, 0];
  const itv = 10;
  let steps = 0;

  const loop = () => {
    cancelAnimationFrame((node as any).effectTimeout);

    (node as any).effectTimeout = requestAnimationFrame(() => {
      const currentStep = Math.floor(steps / itv);
      const current = seq[currentStep];
      const next = seq[currentStep + 1];

      if (next === undefined || next === null) {
        node.style.transform = '';
        node.style.transition = '';
        return;
      }

      const angle = current + ((next - current) / itv) * (steps % itv);
      node.style.transform = `rotate(${angle}deg)`;
      node.style.transition = 'none';

      steps += 1;
      loop();
    });
  };

  loop();
};

// Happy Work Confetti Burst Effect
const HAPPY_COLORS = [
  '#ff4d4f',
  '#fa8c16',
  '#fadb14',
  '#52c41a',
  '#13c2c2',
  '#1677ff',
  '#722ed1',
  '#eb2f96',
];

const showHappyEffect: WaveShowEffect = (node, { component }) => {
  if (component !== 'Button') {
    return;
  }

  const rect = node.getBoundingClientRect();
  const holder = document.createElement('div');
  holder.style.position = 'fixed';
  holder.style.left = `${rect.left}px`;
  holder.style.top = `${rect.top}px`;
  holder.style.width = `${rect.width}px`;
  holder.style.height = `${rect.height}px`;
  holder.style.pointerEvents = 'none';
  holder.style.zIndex = '9999';
  document.body.appendChild(holder);

  const count = 12;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const dots: Array<{ el: HTMLDivElement; dx: number; dy: number }> = [];

  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const distance = 28 + (i % 3) * 10;
    const size = 6 + (i % 2) * 2;
    const dot = createDot(holder, HAPPY_COLORS[i % HAPPY_COLORS.length], centerX, centerY, size);
    dot.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease-out';
    dots.push({
      el: dot,
      dx: Math.cos(angle) * (rect.width * 0.45 + distance),
      dy: Math.sin(angle) * (rect.height * 0.45 + distance),
    });
  }

  requestAnimationFrame(() => {
    dots.forEach(({ el, dx, dy }) => {
      el.style.transform = `translate3d(calc(-50% + ${dx}px), calc(-50% + ${dy}px), 0) scale(0.3)`;
      el.style.opacity = '0';
    });
  });

  setTimeout(() => {
    holder.remove();
  }, 650);
};
</script>
