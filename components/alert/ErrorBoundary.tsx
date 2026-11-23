import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent, onErrorCaptured, shallowRef } from 'vue';
import type { VueNode } from '../_util/type';
import PropTypes from '../_util/vue-types';
import Alert from './index';

export const errorBoundaryProps = () => ({
  title: PropTypes.any as unknown as PropType<VueNode>,
  /** @deprecated please use `title` instead. */
  message: PropTypes.any as unknown as PropType<VueNode>,
  description: PropTypes.any as unknown as PropType<VueNode>,
  id: String,
});

export type AlertErrorBoundaryProps = Partial<
  ExtractPropTypes<ReturnType<typeof errorBoundaryProps>>
>;

const ErrorBoundary = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAlertErrorBoundary',
  props: errorBoundaryProps(),
  setup(props, { slots }) {
    const error = shallowRef<Error | null>(null);
    const errorInfo = shallowRef<string>('');

    onErrorCaptured((err, _instance, info) => {
      error.value = err instanceof Error ? err : new Error(String(err));
      errorInfo.value = info || '';
      return false;
    });

    return () => {
      if (error.value) {
        const mergedTitle = props.title ?? slots.title?.() ?? props.message ?? slots.message?.();
        const mergedDescription = props.description ?? slots.description?.();
        const errorMessage =
          mergedTitle !== undefined && mergedTitle !== null ? mergedTitle : error.value.toString();
        const errorDescription =
          mergedDescription !== undefined && mergedDescription !== null
            ? mergedDescription
            : error.value.stack || errorInfo.value || null;

        return (
          <Alert
            id={props.id}
            type="error"
            title={errorMessage}
            description={
              <pre style={{ fontSize: '0.9em', overflowX: 'auto' }}>{errorDescription}</pre>
            }
          />
        );
      }

      return slots.default?.();
    };
  },
});

export default ErrorBoundary;
