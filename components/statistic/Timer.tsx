import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import omit from '../_util/omit';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { CustomSlotsType } from '../_util/type';
import { someType } from '../_util/type';
import Statistic, { statisticProps } from './Statistic';
import type { FormatConfig, valueType } from './utils';
import { formatCounter } from './utils';

export type TimerType = 'countdown' | 'countup';

const UPDATE_INTERVAL = 1000 / 30;

function getTime(value?: valueType) {
  return new Date(value as any).getTime();
}

export const timerProps = () => ({
  ...statisticProps(),
  type: String as PropType<TimerType>,
  value: someType<valueType>([Number, String, Object]),
  format: String,
  onFinish: Function as PropType<() => void>,
  onChange: Function as PropType<(value: number) => void>,
});

export type StatisticTimerProps = Partial<ExtractPropTypes<ReturnType<typeof timerProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AStatisticTimer',
  props: initDefaultProps(timerProps(), {
    type: 'countdown',
    format: 'HH:mm:ss',
  }),
  slots: Object as CustomSlotsType<{
    title?: any;
    prefix?: any;
    suffix?: any;
    formatter?: any;
    default?: any;
  }>,
  setup(props, { emit, slots }) {
    const timerId = ref<ReturnType<typeof setInterval>>();
    const tickRef = ref(0);

    const stopTimer = () => {
      if (timerId.value !== undefined) {
        clearInterval(timerId.value);
        timerId.value = undefined;
      }
    };

    const syncTimer = () => {
      stopTimer();
      const timestamp = getTime(props.value);
      if (Number.isNaN(timestamp)) {
        return;
      }
      const down = props.type !== 'countup';
      if (down && timestamp < Date.now()) {
        return;
      }
      timerId.value = setInterval(() => {
        const now = Date.now();
        const currentTimestamp = getTime(props.value);
        const isDown = props.type !== 'countup';
        tickRef.value += 1;

        const timeDiff = isDown ? currentTimestamp - now : now - currentTimestamp;
        emit('change', timeDiff);

        // Only countdown triggers `finish`
        if (isDown && currentTimestamp < now) {
          stopTimer();
          emit('finish');
        }
      }, UPDATE_INTERVAL);
    };

    const formatTimer = ({ value, config }: { value: valueType; config?: FormatConfig }) => {
      const { format, type } = props;
      const down = type !== 'countup';
      return formatCounter(value, { ...config, format }, down);
    };

    const valueRenderHtml = (node: any) => node;

    watch(
      [() => props.value, () => props.type],
      () => {
        syncTimer();
      },
      { flush: 'post' },
    );

    onMounted(() => {
      syncTimer();
    });

    onBeforeUnmount(() => {
      stopTimer();
    });

    return () => {
      // Track tickRef so Statistic re-renders on interval ticks
      // eslint-disable-next-line no-unused-expressions
      tickRef.value;
      const value = props.value as valueType;
      return (
        <Statistic
          {...{
            ...omit(props, ['onFinish', 'onChange', 'type']),
            value,
            valueRender: props.valueRender ?? valueRenderHtml,
            formatter: formatTimer,
          }}
          v-slots={slots}
        />
      );
    };
  },
});
