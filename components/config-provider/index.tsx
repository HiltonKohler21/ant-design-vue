import type { App, MaybeRef, Plugin, WatchStopHandle } from 'vue';
import { watch, computed, reactive, defineComponent, watchEffect } from 'vue';
import defaultRenderEmpty from './renderEmpty';
import type { RenderEmptyHandler } from './renderEmpty';
import type { Locale } from '../locale-provider';
import LocaleProvider, { ANT_MARK } from '../locale-provider';

import LocaleReceiver from '../locale-provider/LocaleReceiver';

import message from '../message';
import notification from '../notification';
import { registerTheme } from './cssVariables';
import defaultLocale from '../locale/en_US';
import type { ValidateMessages } from '../form/interface';
import useStyle from './style';
import useTheme from './hooks/useTheme';
import defaultSeedToken from '../theme/themes/seed';
import type { ConfigProviderInnerProps, ConfigProviderProps, Theme } from './context';
import {
  useConfigContextProvider,
  useConfigContextInject,
  configProviderProps,
  useProvideGlobalForm,
  defaultIconPrefixCls,
} from './context';
import { useProviderSize } from './SizeContext';
import { useProviderDisabled } from './DisabledContext';
import { createTheme } from '../_util/cssinjs';
import { DesignTokenProvider, useDesignTokenOptionalInject } from '../theme/internal';

export type {
  ConfigProviderProps,
  Theme,
  SizeType,
  Direction,
  CSPConfig,
  DirectionType,
  Variant,
} from './context';
export { Variants } from './context';
export const defaultPrefixCls = 'ant';
export { defaultIconPrefixCls };
function getGlobalPrefixCls() {
  return globalConfigForApi.prefixCls || defaultPrefixCls;
}

function getGlobalIconPrefixCls() {
  return globalConfigForApi.iconPrefixCls || defaultIconPrefixCls;
}
const globalConfigBySet = reactive<ConfigProviderProps>({}); // 权重最大
export const globalConfigForApi: ConfigProviderProps & {
  getRootPrefixCls?: (rootPrefixCls?: string, customizePrefixCls?: string) => string;
} = reactive({});

export const configConsumerProps = [
  'getTargetContainer',
  'getPopupContainer',
  'rootPrefixCls',
  'getPrefixCls',
  'renderEmpty',
  'csp',
  'autoInsertSpaceInButton',
  'locale',
  'pageHeader',
];

watchEffect(() => {
  Object.assign(globalConfigForApi, globalConfigBySet);
  globalConfigForApi.prefixCls = getGlobalPrefixCls();
  globalConfigForApi.iconPrefixCls = getGlobalIconPrefixCls();
  globalConfigForApi.getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls
      ? `${globalConfigForApi.prefixCls}-${suffixCls}`
      : globalConfigForApi.prefixCls;
  };
  globalConfigForApi.getRootPrefixCls = () => {
    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls;
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  };
});

type GlobalConfigProviderProps = {
  prefixCls?: MaybeRef<ConfigProviderProps['prefixCls']>;
  iconPrefixCls?: MaybeRef<ConfigProviderProps['iconPrefixCls']>;
  getPopupContainer?: ConfigProviderProps['getPopupContainer'];
};

let stopWatchEffect: WatchStopHandle;
const setGlobalConfig = (params: GlobalConfigProviderProps & { theme?: Theme }) => {
  if (stopWatchEffect) {
    stopWatchEffect();
  }
  stopWatchEffect = watchEffect(() => {
    Object.assign(globalConfigBySet, reactive(params));
    Object.assign(globalConfigForApi, reactive(params));
  });
  if (params.theme) {
    registerTheme(getGlobalPrefixCls(), params.theme);
  }
};

export const globalConfig = () => ({
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
  },
  getIconPrefixCls: getGlobalIconPrefixCls,
  getRootPrefixCls: () => {
    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls;
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  },
});

const ConfigProvider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AConfigProvider',
  inheritAttrs: false,
  props: configProviderProps(),
  setup(props, { slots }) {
    const parentContext = useConfigContextInject();
    const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
      const { prefixCls = 'ant' } = props;
      if (customizePrefixCls) return customizePrefixCls;
      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('');
      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
    };
    const iconPrefixCls = computed(
      () => props.iconPrefixCls || parentContext.iconPrefixCls.value || defaultIconPrefixCls,
    );
    const shouldWrapSSR = computed(() => iconPrefixCls.value !== parentContext.iconPrefixCls.value);
    const csp = computed(() => props.csp || parentContext.csp?.value);

    // 图标样式在 DesignTokenContext provide 之前生成，需显式传入 zeroRuntime
    const zeroRuntime = computed(() => (props.theme as any)?.zeroRuntime ?? false);
    const wrapSSR = useStyle(iconPrefixCls, zeroRuntime);

    const mergedTheme = useTheme(
      computed(() => props.theme),
      computed(() => parentContext.theme?.value),
    );
    const renderEmptyComponent = (name?: string) => {
      const renderEmpty = (props.renderEmpty ||
        slots.renderEmpty ||
        parentContext.renderEmpty ||
        defaultRenderEmpty) as RenderEmptyHandler;
      return renderEmpty(name);
    };
    const autoInsertSpaceInButton = computed(
      () => props.autoInsertSpaceInButton ?? parentContext.autoInsertSpaceInButton?.value,
    );
    const locale = computed(() => props.locale || parentContext.locale?.value);
    watch(
      locale,
      () => {
        globalConfigBySet.locale = locale.value;
      },
      { immediate: true },
    );
    const direction = computed(() => props.direction || parentContext.direction?.value);
    const space = computed(() => props.space ?? parentContext.space?.value);
    const virtual = computed(() => props.virtual ?? parentContext.virtual?.value);
    const dropdownMatchSelectWidth = computed(
      () => props.dropdownMatchSelectWidth ?? parentContext.dropdownMatchSelectWidth?.value,
    );
    const popupMatchSelectWidth = computed(
      () => props.popupMatchSelectWidth ?? dropdownMatchSelectWidth.value,
    );
    const popupOverflow = computed(() => props.popupOverflow ?? parentContext.popupOverflow?.value);
    const holderRender = computed(() => props.holderRender ?? parentContext.holderRender?.value);
    const getTargetContainer = computed(() =>
      props.getTargetContainer !== undefined
        ? props.getTargetContainer
        : parentContext.getTargetContainer?.value,
    );
    const getPopupContainer = computed(() =>
      props.getPopupContainer !== undefined
        ? props.getPopupContainer
        : parentContext.getPopupContainer?.value,
    );
    const pageHeader = computed(() =>
      props.pageHeader !== undefined ? props.pageHeader : parentContext.pageHeader?.value,
    );
    const input = computed(() =>
      props.input !== undefined ? props.input : parentContext.input?.value,
    );
    const pagination = computed(() =>
      props.pagination !== undefined ? props.pagination : parentContext.pagination?.value,
    );
    const form = computed(() =>
      props.form !== undefined ? props.form : parentContext.form?.value,
    );
    const select = computed(() =>
      props.select !== undefined ? props.select : parentContext.select?.value,
    );
    const componentSize = computed(() => props.componentSize);
    const componentDisabled = computed(() => props.componentDisabled);
    const wave = computed(() => props.wave ?? parentContext.wave?.value);
    const variant = computed(() => props.variant ?? parentContext.variant?.value);
    const alert = computed(() => props.alert ?? parentContext.alert?.value);
    const anchor = computed(() => props.anchor ?? parentContext.anchor?.value);
    const avatar = computed(() => props.avatar ?? parentContext.avatar?.value);
    const badge = computed(() => props.badge ?? parentContext.badge?.value);
    const breadcrumb = computed(() => props.breadcrumb ?? parentContext.breadcrumb?.value);
    const button = computed(() => props.button ?? parentContext.button?.value);
    const calendar = computed(() => props.calendar ?? parentContext.calendar?.value);
    const card = computed(() => props.card ?? parentContext.card?.value);
    const carousel = computed(() => props.carousel ?? parentContext.carousel?.value);
    const cascader = computed(() => props.cascader ?? parentContext.cascader?.value);
    const checkbox = computed(() => props.checkbox ?? parentContext.checkbox?.value);
    const collapse = computed(() => props.collapse ?? parentContext.collapse?.value);
    const colorPicker = computed(() => props.colorPicker ?? parentContext.colorPicker?.value);
    const datePicker = computed(() => props.datePicker ?? parentContext.datePicker?.value);
    const descriptions = computed(() => props.descriptions ?? parentContext.descriptions?.value);
    const divider = computed(() => props.divider ?? parentContext.divider?.value);
    const drawer = computed(() => props.drawer ?? parentContext.drawer?.value);
    const dropdown = computed(() => props.dropdown ?? parentContext.dropdown?.value);
    const floatButton = computed(() => props.floatButton ?? parentContext.floatButton?.value);
    const floatButtonGroup = computed(
      () => props.floatButtonGroup ?? parentContext.floatButtonGroup?.value,
    );
    const inputNumber = computed(() => props.inputNumber ?? parentContext.inputNumber?.value);
    const layout = computed(() => props.layout ?? parentContext.layout?.value);
    const list = computed(() => props.list ?? parentContext.list?.value);
    const mentions = computed(() => props.mentions ?? parentContext.mentions?.value);
    const menu = computed(() => props.menu ?? parentContext.menu?.value);
    const modal = computed(() => props.modal ?? parentContext.modal?.value);
    const popconfirm = computed(() => props.popconfirm ?? parentContext.popconfirm?.value);
    const popover = computed(() => props.popover ?? parentContext.popover?.value);
    const progress = computed(() => props.progress ?? parentContext.progress?.value);
    const radio = computed(() => props.radio ?? parentContext.radio?.value);
    const rangePicker = computed(() => props.rangePicker ?? parentContext.rangePicker?.value);
    const rate = computed(() => props.rate ?? parentContext.rate?.value);
    const result = computed(() => props.result ?? parentContext.result?.value);
    const segmented = computed(() => props.segmented ?? parentContext.segmented?.value);
    const skeleton = computed(() => props.skeleton ?? parentContext.skeleton?.value);
    const slider = computed(() => props.slider ?? parentContext.slider?.value);
    const spin = computed(() => props.spin ?? parentContext.spin?.value);
    const splitter = computed(() => props.splitter ?? parentContext.splitter?.value);
    const statistic = computed(() => props.statistic ?? parentContext.statistic?.value);
    const steps = computed(() => props.steps ?? parentContext.steps?.value);
    const tabs = computed(() => props.tabs ?? parentContext.tabs?.value);
    const tag = computed(() => props.tag ?? parentContext.tag?.value);
    const textArea = computed(() => props.textArea ?? parentContext.textArea?.value);
    const timePicker = computed(() => props.timePicker ?? parentContext.timePicker?.value);
    const timeline = computed(() => props.timeline ?? parentContext.timeline?.value);
    const tooltip = computed(() => props.tooltip ?? parentContext.tooltip?.value);
    const tour = computed(() => props.tour ?? parentContext.tour?.value);
    const transfer = computed(() => props.transfer ?? parentContext.transfer?.value);
    const tree = computed(() => props.tree ?? parentContext.tree?.value);
    const treeSelect = computed(() => props.treeSelect ?? parentContext.treeSelect?.value);
    const typography = computed(() => props.typography ?? parentContext.typography?.value);
    const upload = computed(() => props.upload ?? parentContext.upload?.value);
    const image = computed(() => props.image ?? parentContext.image?.value);
    const empty = computed(() => props.empty ?? parentContext.empty?.value);
    const switchConfig = computed(() => props.switch ?? parentContext.switch?.value);
    const messageConfig = computed(() => props.message ?? parentContext.message?.value);
    const table = computed(() => props.table ?? parentContext.table?.value);
    const notificationConfig = computed(
      () => props.notification ?? parentContext.notification?.value,
    );
    const flex = computed(() => props.flex ?? parentContext.flex?.value);
    const warning = computed(() => props.warning ?? parentContext.warning?.value);
    const configProvider: ConfigProviderInnerProps = {
      csp,
      variant,
      autoInsertSpaceInButton,
      locale,
      direction,
      space,
      virtual,
      dropdownMatchSelectWidth,
      popupMatchSelectWidth,
      popupOverflow,
      holderRender,
      getPrefixCls,
      iconPrefixCls,
      theme: computed(() => {
        return mergedTheme.value ?? parentContext.theme?.value;
      }),
      renderEmpty: renderEmptyComponent,
      getTargetContainer,
      getPopupContainer,
      pageHeader,
      input,
      pagination,
      form,
      select,
      componentSize,
      componentDisabled,
      alert,
      anchor,
      avatar,
      badge,
      breadcrumb,
      button,
      calendar,
      card,
      carousel,
      cascader,
      checkbox,
      collapse,
      colorPicker,
      datePicker,
      descriptions,
      divider,
      drawer,
      dropdown,
      floatButton,
      floatButtonGroup,
      inputNumber,
      layout,
      list,
      mentions,
      menu,
      modal,
      popconfirm,
      popover,
      progress,
      radio,
      rangePicker,
      rate,
      result,
      segmented,
      skeleton,
      slider,
      spin,
      splitter,
      statistic,
      steps,
      tabs,
      tag,
      textArea,
      timePicker,
      timeline,
      tooltip,
      tour,
      transfer,
      tree,
      treeSelect,
      typography,
      upload,
      image,
      empty,
      switch: switchConfig,
      message: messageConfig,
      table,
      notification: notificationConfig,
      flex,
      warning,
      transformCellText: computed(() => props.transformCellText),
      wave,
    };

    // ================================ Dynamic theme ================================
    const memoTheme = computed(() => {
      const { algorithm, token, ...rest } = mergedTheme.value || {};
      const themeObj =
        algorithm && (!Array.isArray(algorithm) || algorithm.length > 0)
          ? createTheme(algorithm)
          : undefined;
      return {
        ...rest,
        theme: themeObj,

        token: {
          ...defaultSeedToken,
          ...token,
        },
      };
    });
    // ============================= CSS 变量作用域保护 =============================
    // 变量块是全局 :root，无法按子树隔离；嵌套的 ConfigProvider 若自定义了主题，
    // 其变量块会「后注册胜出」并泄漏到整页（典型场景：文档站里成百上千个 demo 各自
    // 设置 token/algorithm）。因此：嵌套 + 本地自定义主题时，回退到 hash 模式。
    const parentDesignToken = useDesignTokenOptionalInject();
    const locallyCustomizedTheme = computed(() => {
      const t: any = props.theme || {};
      const hasToken = t.token && Object.keys(t.token).length > 0;
      const hasComponents = t.components && Object.keys(t.components).length > 0;
      const hasAlgorithm = Array.isArray(t.algorithm)
        ? t.algorithm.length > 0
        : !!t.algorithm;
      return !!(hasToken || hasComponents || hasAlgorithm);
    });
    const resolvedDesignToken = computed(() => {
      const base = memoTheme.value as any;
      if (parentDesignToken && locallyCustomizedTheme.value) {
        return { ...base, cssVar: false };
      }
      return base;
    });

    const validateMessagesRef = computed(() => {
      // Additional Form provider
      let validateMessages: ValidateMessages = {};

      if (locale.value) {
        validateMessages =
          locale.value.Form?.defaultValidateMessages ||
          defaultLocale.Form?.defaultValidateMessages ||
          {};
      }
      if (props.form && props.form.validateMessages) {
        validateMessages = { ...validateMessages, ...props.form.validateMessages };
      }
      return validateMessages;
    });
    useConfigContextProvider(configProvider);
    useProvideGlobalForm({ validateMessages: validateMessagesRef });
    useProviderSize(componentSize);
    useProviderDisabled(componentDisabled);

    const renderProvider = (legacyLocale: Locale) => {
      let childNode = shouldWrapSSR.value ? wrapSSR(slots.default?.()) : slots.default?.();
      if (props.theme)
        childNode = <DesignTokenProvider value={resolvedDesignToken.value}>{childNode}</DesignTokenProvider>;
      return (
        <LocaleProvider locale={locale.value || legacyLocale} ANT_MARK__={ANT_MARK}>
          {childNode}
        </LocaleProvider>
      );
    };

    watchEffect(() => {
      if (direction.value) {
        message.config({
          rtl: direction.value === 'rtl',
        });
        notification.config({
          rtl: direction.value === 'rtl',
        });
      }
    });

    return () => (
      <LocaleReceiver children={(_, __, legacyLocale) => renderProvider(legacyLocale as Locale)} />
    );
  },
});

ConfigProvider.config = setGlobalConfig;

ConfigProvider.install = function (app: App) {
  app.component(ConfigProvider.name, ConfigProvider);
};

export default ConfigProvider as typeof ConfigProvider &
  Plugin & {
    readonly config: typeof setGlobalConfig;
  };
