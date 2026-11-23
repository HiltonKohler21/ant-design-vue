import { defineComponent, computed, ref } from 'vue';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import { useLocaleReceiver } from '../locale/LocaleReceiver';
import { withInstall } from '../_util/type';
import Spin from '../spin';
import Button from '../button';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { useToken } from '../theme/internal';
import { QRCodeCanvas, QRCodeSVG } from './QRCode';
import warning from '../_util/warning';
import { qrcodeProps } from './interface';

export type QRCodeProps = Partial<ExtractPropTypes<ReturnType<typeof qrcodeProps>>>;
const QRCode = defineComponent({
  name: 'AQrcode',
  inheritAttrs: false,
  props: qrcodeProps(),
  emits: ['refresh'],
  slots: Object as any,
  setup(props, { emit, attrs, expose, slots }) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        !(props.icon && props.errorLevel === 'L'),
        'QRCode',
        'ErrorLevel `L` is not recommended to be used with `icon`, for scanning result would be affected by low level.',
      );
    }
    const [locale] = useLocaleReceiver('QRCode');
    const { prefixCls } = useConfigInject('qrcode', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    // realToken：未变量化的原始 token。QR 码尺寸/画布颜色参与 JS 计算与 Canvas 绘制，
    // cssVar 模式下 token 值是 var() 字符串，必须使用真实值。
    const [, , , realToken] = useToken();
    const qrCodeCanvas = ref();
    expose({
      toDataURL: (type?: string, quality?: any) => {
        return qrCodeCanvas.value?.toDataURL(type, quality);
      },
    });
    const qrCodeProps = computed(() => {
      const {
        value,
        icon = '',
        size = 160,
        iconSize = 40,
        color = realToken.value.colorText,
        bgColor = 'transparent',
        errorLevel = 'M',
      } = props;
      const imageSettings: QRCodeProps['imageSettings'] = {
        src: icon,
        x: undefined,
        y: undefined,
        height: iconSize,
        width: iconSize,
        excavate: true,
      };
      return {
        value,
        size: size - (Number(realToken.value.paddingSM) + Number(realToken.value.lineWidth)) * 2,
        level: errorLevel,
        bgColor,
        fgColor: color,
        imageSettings: icon ? imageSettings : undefined,
      };
    });
    return () => {
      const pre = prefixCls.value;
      const customStatusNode = props.status !== 'active' ? slots.statusRender?.(props) : undefined;
      return wrapSSR(
        <div
          {...attrs}
          style={[
            attrs.style as CSSProperties,
            {
              width: `${props.size}px`,
              height: `${props.size}px`,
              backgroundColor: qrCodeProps.value.bgColor,
            },
          ]}
          class={[
            hashId.value,
            pre,
            props.rootClassName,
            {
              [`${pre}-borderless`]: !props.bordered,
            },
          ]}
        >
          {props.status !== 'active' && (
            <div class={`${pre}-mask`}>
              {customStatusNode ? (
                customStatusNode
              ) : (
                <>
                  {props.status === 'loading' && <Spin />}
                  {props.status === 'expired' && (
                    <>
                      <p class={`${pre}-expired`}>{locale.value.expired}</p>
                      <Button
                        type="link"
                        onClick={e => {
                          emit('refresh', e);
                        }}
                        v-slots={{ icon: () => <ReloadOutlined /> }}
                      >
                        {locale.value.refresh}
                      </Button>
                    </>
                  )}
                  {props.status === 'scanned' && (
                    <p class={`${pre}-scanned`}>{locale.value.scanned}</p>
                  )}
                </>
              )}
            </div>
          )}
          {props.type === 'canvas' ? (
            <QRCodeCanvas ref={qrCodeCanvas} {...qrCodeProps.value} />
          ) : (
            <QRCodeSVG {...qrCodeProps.value} />
          )}
        </div>,
      );
    };
  },
});
export default withInstall(QRCode);
