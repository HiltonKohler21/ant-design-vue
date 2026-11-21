import { useStyleRegister } from '../../_util/cssinjs';
import { resetIcon } from '../../style';
import { useToken } from '../../theme/internal';
import { computed, Ref } from 'vue';

const useStyle = (iconPrefixCls: Ref<string>, zeroRuntime?: Ref<boolean>) => {
  const [theme, token] = useToken({ zeroRuntime });
  // Generate style for icons
  return useStyleRegister(
    computed(() => ({
      theme: theme.value,
      token: token.value,
      hashId: '',
      path: ['ant-design-icons', iconPrefixCls.value],
      zeroRuntime: zeroRuntime?.value,
    })),
    () => [
      {
        [`.${iconPrefixCls.value}`]: {
          ...resetIcon(),
          [`.${iconPrefixCls.value} .${iconPrefixCls.value}-icon`]: {
            display: 'block',
          },
        },
      },
    ],
  );
};

export default useStyle;
