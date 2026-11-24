import { defineComponent } from 'vue';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AStepsPanelArrow',
  props: {
    prefixCls: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <svg
        aria-hidden="true"
        class={`${props.prefixCls}-panel-arrow`}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path d="M 0 0 L 100 50 L 0 100" />
      </svg>
    );
  },
});
