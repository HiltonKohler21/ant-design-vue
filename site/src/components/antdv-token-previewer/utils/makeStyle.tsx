import type { CSSInterpolation } from '@hiltonkohler21/ant-design-vue/es/_util/cssinjs';
import { useStyleRegister } from '@hiltonkohler21/ant-design-vue/es/_util/cssinjs';
import { theme as antdTheme } from '@hiltonkohler21/ant-design-vue';
import type { GlobalToken } from '@hiltonkohler21/ant-design-vue/es/theme/interface';
import { mergeToken } from '@hiltonkohler21/ant-design-vue/es/theme/internal';
import { computed } from 'vue';
import useConfigInject from '@hiltonkohler21/ant-design-vue/es/config-provider/hooks/useConfigInject';

import type { UseComponentStyleResult } from '@hiltonkohler21/ant-design-vue/es/theme/internal';
const makeStyle = (
  path: string,
  styleFn: (token: GlobalToken & { rootCls: string }) => CSSInterpolation,
) => {
  return (): UseComponentStyleResult => {
    // cssVar 模式下 token 的值是 `var(--ant-*)`；预览器自身的样式由 JS 拼装
    // （`${token.x}px`、算术、TinyColor），必须使用 realToken 的原始数值/色值。
    const { theme, token, hashId, realToken } = antdTheme.useToken();

    const { getPrefixCls } = useConfigInject('', {});

    const rootCls = getPrefixCls();

    const componentInfo = computed(() => {
      return {
        theme: theme.value,
        token: token.value,
        hashId: hashId.value,
        path: [path],
      };
    });
    return [
      useStyleRegister(componentInfo, () => {
        const mergedToken = mergeToken<GlobalToken & { rootCls: string }>(
          token.value,
          (realToken?.value as GlobalToken) ?? {},
          { rootCls: `.${rootCls}` },
        );
        const styleInterpolation = styleFn(mergedToken);

        return [styleInterpolation];
      }),
      hashId,
    ];
  };
};

export default makeStyle;
