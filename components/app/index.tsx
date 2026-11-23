import { defineComponent, computed } from 'vue';
import type { App as TypeApp, Plugin } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import { objectType } from '../_util/type';
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
    rootClassName: String,
    message: objectType<AppConfig['message']>(),
    notification: objectType<AppConfig['notification']>(),
  };
};

const useApp = () => {
  return useInjectAppContext();
};

const App = defineComponent({
  name: 'AApp',
  props: initDefaultProps(AppProps(), {}),
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('app', props);
    const { className: contextClassName, style: contextStyle } = useComponentConfig('app');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const customClassName = computed(() => {
      return classNames(hashId.value, prefixCls.value, props.rootClassName, contextClassName.value);
    });

    const appConfig = useInjectAppConfigContext();
    const mergedAppConfig = computed(() => ({
      message: { ...appConfig.message, ...props.message },
      notification: { ...appConfig.notification, ...props.notification },
    }));
    useProvideAppConfigContext(mergedAppConfig.value);

    const [messageApi, messageContextHolder] = useMessage(mergedAppConfig.value.message);
    const [notificationApi, notificationContextHolder] = useNotification(
      mergedAppConfig.value.notification,
    );
    const [ModalApi, ModalContextHolder] = useModal();

    const memoizedContextValue = computed(() => ({
      message: messageApi,
      notification: notificationApi,
      modal: ModalApi,
    }));
    useProvideAppContext(memoizedContextValue.value);

    return () => {
      return wrapSSR(
        <div class={customClassName.value} style={contextStyle.value}>
          {ModalContextHolder()}
          {messageContextHolder()}
          {notificationContextHolder()}
          {slots.default?.()}
        </div>,
      );
    };
  },
});

App.useApp = useApp;

App.install = function (app: TypeApp) {
  app.component(App.name, App);
};

export default App as typeof App &
  Plugin & {
    readonly useApp: typeof useApp;
  };
