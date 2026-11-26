<docs>
---
order: 4
version: 4.3.0
title:
  zh-CN: 自定义波纹
  en-US: Custom Wave
---

## zh-CN

波纹效果带来了灵动性，可以通过 `wave.showEffect` 自定义波纹动效，并通过 `component` 判断触发来自哪个组件。

## en-US

Wave effect brings dynamic feedback. Use `wave.showEffect` to customize wave effects and `component` to determine which component triggered it.
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
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

type WaveConfig = NonNullable<ConfigProviderProps['wave']>;

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
const showInsetEffect: WaveConfig['showEffect'] = (node, { event, component }) => {
  if (component !== 'Button') {
    return;
  }

  const holder = createHolder(node);
  const rect = holder.getBoundingClientRect();
  const left = event.clientX - rect.left;
  const top = event.clientY - rect.top;

  const dot = createDot(holder, 'rgba(255, 255, 255, 0.65)', left, top);

  requestAnimationFrame(() => {
    const cleanup = () => {
      holder.remove();
    };
    dot.ontransitionend = cleanup;
    setTimeout(cleanup, 1100);

    dot.style.width = '200px';
    dot.style.height = '200px';
    dot.style.opacity = '0';
  });
};

// Shake Effect
const showShakeEffect: WaveConfig['showEffect'] = (node, { component }) => {
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

// Happy Work Confetti Effect
const showHappyEffect: WaveConfig['showEffect'] = (node, { event, component }) => {
  if (component !== 'Button') {
    return;
  }

  const holder = createHolder(node);
  holder.style.overflow = 'visible';
  const rect = holder.getBoundingClientRect();
  const left = event.clientX - rect.left;
  const top = event.clientY - rect.top;
  const colors = ['#ff4d4f', '#faad14', '#52c41a', '#1677ff', '#722ed1', '#eb2f96'];

  const dots = colors.map((color, idx) => {
    const dot = createDot(holder, color, left, top, 6);
    dot.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
    const angle = (Math.PI * 2 * idx) / colors.length;
    const distance = 28 + (idx % 2) * 10;
    return {
      dot,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
    };
  });

  requestAnimationFrame(() => {
    dots.forEach(({ dot, dx, dy }) => {
      dot.style.transform = `translate3d(calc(-50% + ${dx}px), calc(-50% + ${dy}px), 0) scale(0.4)`;
      dot.style.opacity = '0';
    });
    setTimeout(() => {
      holder.remove();
    }, 650);
  });
};
</script>
