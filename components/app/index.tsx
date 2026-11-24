import { defineComponent, computed, reactive, watchEffect } from 'vue';
import type { App as TypeApp, Component, ExtractPropTypes, Plugin } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import omit from '../_util/omit';
import { objectType, someType } from '../_util/type';
import warning from '../_util/warning';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import useMessage from '../message/useMessage';
import useModal from '../modal/useModal';
import useNotification from '../notification/useNotification';
import type { AppConfig } from './context';
import {
  useProvideAppConfigContext,
  useInjectAppConfigContext,
  useProvideAppContext,
  useInjectAppContext,
} from './context';
import useStyle from './style';

export const AppProps = () => {
  return {
    prefixCls: String,
    rootClassName: String,
    component: someType<string | Component | false>([String, Object, Function, Boolean]),
    message: objectType<AppConfig['message']>(),
    notification: objectType<AppConfig['notification']>(),
  };
};

export type AppProps = Partial<ExtractPropTypes<ReturnType<typeof AppProps>>>;

const useApp = () => {
  return useInjectAppContext();
};

const App = defineComponent({
  name: 'AApp',
  inheritAttrs: false,
  props: initDefaultProps(AppProps(), {
    component: 'div',
  }),
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('app', props);
    const { className: contextClassName, style: contextStyle } = useComponentConfig('app');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const customClassName = computed(() => {
      return classNames(
        hashId.value,
        prefixCls.value,
        props.rootClassName,
        contextClassName.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        attrs.class as any,
      );
    });
    const mergedStyle = computed(() =>
      contextStyle.value || attrs.style
        ? [contextStyle.value, attrs.style as any].filter(Boolean)
        : undefined,
    );

    const appConfig = useInjectAppConfigContext();
    const mergedAppConfig = computed<AppConfig>(() => ({
      message: { ...appConfig.message, ...props.message },
      notification: { ...appConfig.notification, ...props.notification },
    }));
    useProvideAppConfigContext(
      reactive({
        get message() {
          return mergedAppConfig.value.message;
        },
        get notification() {
          return mergedAppConfig.value.notification;
        },
      }),
    );

    const messageConfig = computed(() => mergedAppConfig.value.message);
    const notificationConfig = computed(() => mergedAppConfig.value.notification);

    const [messageApi, messageContextHolder] = useMessage(messageConfig);
    const [notificationApi, notificationContextHolder] = useNotification(notificationConfig);
    const [ModalApi, ModalContextHolder] = useModal();

    const memoizedContextValue = computed(() => ({
      message: messageApi,
      notification: notificationApi,
      modal: ModalApi,
    }));
    useProvideAppContext(memoizedContextValue.value);

    if (process.env.NODE_ENV !== 'production') {
      watchEffect(() => {
        const hasRootProps = Boolean(
          props.rootClassName ||
            contextClassName.value ||
            contextStyle.value ||
            attrs.class ||
            attrs.style,
        );
        warning(
          !(props.component === false && hasRootProps),
          'App',
          'When `component` is `false`, `class`, `rootClassName`, and `style` will not be applied.',
        );
      });
    }

    return () => {
      const content = (
        <>
          {ModalContextHolder()}
          {messageContextHolder()}
          {notificationContextHolder()}
          {slots.default?.()}
        </>
      );

      if (props.component === false) {
        return wrapSSR(content);
      }

      const ComponentTag: any = props.component || 'div';
      const restAttrs = omit(attrs, ['class', 'style']);

      return wrapSSR(
        <ComponentTag {...restAttrs} class={customClassName.value} style={mergedStyle.value}>
          {content}
        </ComponentTag>,
      );
    };
  },
});

App.useApp = useApp;

App.install = function (app: TypeApp) {
  app.component(App.name, App);
  return app;
};

export default App as typeof App &
  Plugin & {
    readonly useApp: typeof useApp;
  };
