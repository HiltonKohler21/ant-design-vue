import { defineComponent, computed, ref } from 'vue';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import useMergeSemantic from '../_util/hooks/useMergeSemantic';
import useStyle from './style';
import { useLocaleReceiver } from '../locale/LocaleReceiver';
import { withInstall } from '../_util/type';
import Spin from '../spin';
import Button from '../button';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { useToken } from '../theme/internal';
import { QRCodeCanvas, QRCodeSVG } from './QRCode';
import warning from '../_util/warning';
import type {
  QRCodeClassNamesType,
  QRCodeSemanticClassNames,
  QRCodeSemanticName,
  QRCodeSemanticStyles,
  QRCodeStylesType,
  QRStatus,
  StatusRenderInfo,
} from './interface';
import { qrcodeProps } from './interface';

export type {
  QRStatus,
  StatusRenderInfo,
  QRCodeSemanticName,
  QRCodeSemanticClassNames,
  QRCodeSemanticStyles,
  QRCodeClassNamesType,
  QRCodeStylesType,
};
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
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('qrcode');
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

    const mergedProps = computed<QRCodeProps>(() => ({
      ...props,
      bgColor: props.bgColor ?? 'transparent',
      type: props.type ?? 'canvas',
      size: props.size ?? 160,
      status: props.status ?? 'active',
      bordered: props.bordered ?? true,
      errorLevel: props.errorLevel ?? 'M',
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      QRCodeSemanticClassNames,
      QRCodeSemanticStyles,
      QRCodeProps
    >(
      () => [contextClassNames.value as QRCodeClassNamesType, props.classNames],
      () => [
        contextStyles.value as QRCodeStylesType,
        contextStyle.value ? { root: contextStyle.value } : undefined,
        props.styles,
        attrs.style ? { root: attrs.style as CSSProperties } : undefined,
      ],
      () => ({ props: mergedProps.value }),
    );

    const qrCodeProps = computed(() => {
      const {
        value,
        icon = '',
        size = 160,
        iconSize = 40,
        color = realToken.value.colorText,
        bgColor = 'transparent',
        errorLevel = 'M',
        marginSize,
      } = props;
      const iconWidth = typeof iconSize === 'number' ? iconSize : iconSize?.width ?? 40;
      const iconHeight = typeof iconSize === 'number' ? iconSize : iconSize?.height ?? 40;
      const imageSettings: QRCodeProps['imageSettings'] = {
        src: icon,
        x: undefined,
        y: undefined,
        height: iconHeight,
        width: iconWidth,
        excavate: true,
      };
      const normalizedValue = Array.isArray(value) ? value.join('\n') : value;
      return {
        value: normalizedValue,
        size: size - (Number(realToken.value.paddingSM) + Number(realToken.value.lineWidth)) * 2,
        level: errorLevel,
        bgColor,
        fgColor: color,
        marginSize,
        imageSettings: icon ? imageSettings : undefined,
      };
    });
    const handleRefresh = (e?: MouseEvent) => {
      emit('refresh', e);
    };
    return () => {
      const pre = prefixCls.value;
      const { class: attrClass, style: _attrStyle, ...restAttrs } = attrs;
      const renderStatus = props.statusRender ?? slots.statusRender;
      const statusInfo: StatusRenderInfo | undefined =
        props.status !== 'active'
          ? {
              status: props.status as Exclude<QRStatus, 'active'>,
              locale: locale.value,
              onRefresh: handleRefresh,
            }
          : undefined;
      const customStatusNode = statusInfo && renderStatus ? renderStatus(statusInfo) : undefined;
      const rootStyle: CSSProperties = {
        width: `${props.size}px`,
        height: `${props.size}px`,
        backgroundColor: qrCodeProps.value.bgColor,
        ...mergedStyles.value.root,
      };
      return wrapSSR(
        <div
          {...restAttrs}
          style={rootStyle}
          class={[
            hashId.value,
            pre,
            contextClassName.value,
            props.rootClassName,
            mergedClassNames.value.root,
            attrClass,
            {
              [`${pre}-borderless`]: !props.bordered,
            },
          ]}
        >
          {props.status !== 'active' && (
            <div
              class={[`${pre}-mask`, mergedClassNames.value.cover]}
              style={mergedStyles.value.cover}
            >
              {customStatusNode !== undefined && customStatusNode !== null ? (
                customStatusNode
              ) : (
                <>
                  {props.status === 'loading' && <Spin />}
                  {props.status === 'expired' && (
                    <>
                      <p class={`${pre}-expired`}>{locale.value.expired}</p>
                      <Button
                        type="link"
                        onClick={handleRefresh}
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
