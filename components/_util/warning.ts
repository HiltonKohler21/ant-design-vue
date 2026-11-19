import vcWarning, { resetWarned } from '../vc-util/warning';

export { resetWarned };
export function noop() {}

type Warning = (valid: boolean, component: string, message?: string) => void;

export const deprecated = (
  valid: boolean,
  prop: string,
  replacement: string,
  component?: string,
) => {
  warning(
    valid,
    component ?? 'Deprecated',
    `\`${prop}\` is deprecated. Please use \`${replacement}\` instead.`,
  );
};

// eslint-disable-next-line import/no-mutable-exports
let warning: Warning = noop;
if (process.env.NODE_ENV !== 'production') {
  warning = (valid, component, message) => {
    vcWarning(valid, `[ant-design-vue: ${component}] ${message}`);

    // StrictMode will inject console which will not throw warning in React 17.
    if (process.env.NODE_ENV === 'test') {
      resetWarned();
    }
  };
}

export default warning;
