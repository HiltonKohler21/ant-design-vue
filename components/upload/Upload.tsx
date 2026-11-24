import type { UploadProps as RcUploadProps } from '../vc-upload';
import VcUpload from '../vc-upload';
import UploadList from './UploadList';
import type {
  UploadFile,
  UploadChangeParam,
  ShowUploadListInterface,
  FileType,
  UploadProps,
  UploadSemanticClassNames,
  UploadSemanticStyles,
} from './interface';
import { uploadProps } from './interface';
import { file2Obj, getFileItem, removeFileItem, updateFileList } from './utils';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/en_US';
import type { CSSProperties } from 'vue';
import { computed, defineComponent, onMounted, ref, toRef } from 'vue';
import { flattenChildren, initDefaultProps } from '../_util/props-util';
import useMergedState from '../_util/hooks/useMergedState';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import devWarning from '../vc-util/devWarning';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import type { VueNode } from '../_util/type';
import classNames from '../_util/classNames';
import { useInjectFormItemContext } from '../form';
import defaultRequest from '../vc-upload/request';
import getUid from '../vc-upload/uid';

// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';

export const LIST_IGNORE = `__LIST_IGNORE_${Date.now()}__`;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AUpload',
  inheritAttrs: false,
  props: initDefaultProps(uploadProps(), {
    type: 'select',
    multiple: false,
    action: '',
    data: {},
    accept: '',
    showUploadList: true,
    listType: 'text', // or picture
    supportServerRender: true,
  }),
  setup(props, { slots, attrs, expose }) {
    const formItemContext = useInjectFormItemContext();
    const { prefixCls, direction, disabled } = useConfigInject('upload', props);
    const {
      componentConfig: uploadConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('upload');

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => disabled.value ?? disabledContext.value);

    const [mergedFileList, setMergedFileList] = useMergedState(props.defaultFileList || [], {
      value: toRef(props, 'fileList'),
      postState: list => {
        const timestamp = Date.now();
        return (list ?? []).map((file, index) => {
          if (!file.uid && !Object.isFrozen(file)) {
            file.uid = `__AUTO__${timestamp}_${index}__`;
          }
          return file;
        });
      },
    });
    const dragState = ref('drop');

    const upload = ref(null);
    onMounted(() => {
      devWarning(
        props.fileList !== undefined || attrs.value === undefined,
        'Upload',
        '`value` is not a valid prop, do you mean `fileList`?',
      );

      devWarning(
        props.transformFile === undefined,
        'Upload',
        '`transformFile` is deprecated. Please use `beforeUpload` directly.',
      );
      devWarning(
        props.remove === undefined,
        'Upload',
        '`remove` props is deprecated. Please use `remove` event.',
      );
    });

    const onInternalChange = (
      file: UploadFile,
      changedFileList: UploadFile[],
      event?: { percent: number },
    ) => {
      let cloneList = [...changedFileList];

      // Cut to match count
      if (props.maxCount === 1) {
        cloneList = cloneList.slice(-1);
      } else if (props.maxCount) {
        cloneList = cloneList.slice(0, props.maxCount);
      }

      setMergedFileList(cloneList);

      const changeInfo: UploadChangeParam<UploadFile> = {
        file: file as UploadFile,
        fileList: cloneList,
      };

      if (event) {
        changeInfo.event = event;
      }
      props['onUpdate:fileList']?.(changeInfo.fileList);
      props.onChange?.(changeInfo);
      formItemContext.onFieldChange();
    };

    const mergedBeforeUpload = async (file: FileType, fileListArgs: FileType[]) => {
      const { beforeUpload, transformFile } = props;

      let parsedFile: FileType | Blob | string = file;
      if (beforeUpload) {
        const result = await beforeUpload(file, fileListArgs);

        if (result === false) {
          return false;
        }

        // Hack for LIST_IGNORE, we add additional info to remove from the list
        delete (file as any)[LIST_IGNORE];
        if ((result as any) === LIST_IGNORE) {
          Object.defineProperty(file, LIST_IGNORE, {
            value: true,
            configurable: true,
          });
          return false;
        }

        if (typeof result === 'object' && result) {
          parsedFile = result as File;
        }
      }

      if (transformFile) {
        parsedFile = await transformFile(parsedFile as any);
      }

      return parsedFile as File;
    };

    const onBatchStart: RcUploadProps['onBatchStart'] = batchFileInfoList => {
      // Skip file which marked as `LIST_IGNORE`, these file will not add to file list
      const filteredFileInfoList = batchFileInfoList.filter(
        info => !(info.file as any)[LIST_IGNORE],
      );

      // Nothing to do since no file need upload
      if (!filteredFileInfoList.length) {
        return;
      }

      const objectFileList = filteredFileInfoList.map(info => file2Obj(info.file as FileType));

      // Concat new files with prev files
      let newFileList = [...mergedFileList.value];

      objectFileList.forEach(fileObj => {
        // Replace file if exist
        newFileList = updateFileList(fileObj, newFileList);
      });

      objectFileList.forEach((fileObj, index) => {
        // Repeat trigger `onChange` event for compatible
        let triggerFileObj: UploadFile = fileObj;

        if (!filteredFileInfoList[index].parsedFile) {
          // `beforeUpload` return false
          const { originFileObj } = fileObj;
          let clone;

          try {
            clone = new File([originFileObj], originFileObj.name, {
              type: originFileObj.type,
            }) as any as UploadFile;
          } catch (e) {
            clone = new Blob([originFileObj], {
              type: originFileObj.type,
            }) as any as UploadFile;
            clone.name = originFileObj.name;
            clone.lastModifiedDate = new Date();
            clone.lastModified = new Date().getTime();
          }

          clone.uid = fileObj.uid;
          triggerFileObj = clone;
        } else {
          // Inject `uploading` status
          fileObj.status = 'uploading';
        }

        onInternalChange(triggerFileObj, newFileList);
      });
    };

    const onSuccess = (response: any, file: FileType, xhr: any) => {
      try {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
      } catch (e) {
        /* do nothing */
      }

      // removed
      if (!getFileItem(file, mergedFileList.value)) {
        return;
      }

      const targetItem = file2Obj(file);
      targetItem.status = 'done';
      targetItem.percent = 100;
      targetItem.response = response;
      targetItem.xhr = xhr;

      const nextFileList = updateFileList(targetItem, mergedFileList.value);

      onInternalChange(targetItem, nextFileList);
    };

    const onProgress = (e: { percent: number }, file: FileType) => {
      // removed
      if (!getFileItem(file, mergedFileList.value)) {
        return;
      }

      const targetItem = file2Obj(file);
      targetItem.status = 'uploading';
      targetItem.percent = e.percent;

      const nextFileList = updateFileList(targetItem, mergedFileList.value);

      onInternalChange(targetItem, nextFileList, e);
    };

    const onError = (error: Error, response: any, file: FileType) => {
      // removed
      if (!getFileItem(file, mergedFileList.value)) {
        return;
      }

      const targetItem = file2Obj(file);
      targetItem.error = error;
      targetItem.response = response;
      targetItem.status = 'error';

      const nextFileList = updateFileList(targetItem, mergedFileList.value);

      onInternalChange(targetItem, nextFileList);
    };

    const handleRemove = (file: UploadFile) => {
      let currentFile: UploadFile;
      const mergedRemove = props.onRemove || props.remove;
      Promise.resolve(typeof mergedRemove === 'function' ? mergedRemove(file) : mergedRemove).then(
        ret => {
          // Prevent removing file
          if (ret === false) {
            return;
          }

          const removedFileList = removeFileItem(file, mergedFileList.value);

          if (removedFileList) {
            currentFile = { ...file, status: 'removed' };
            mergedFileList.value?.forEach(item => {
              const matchKey = currentFile.uid !== undefined ? 'uid' : 'name';
              if (item[matchKey] === currentFile[matchKey] && !Object.isFrozen(item)) {
                item.status = 'removed';
              }
            });
            upload.value?.abort(currentFile);

            onInternalChange(currentFile, removedFileList);
          }
        },
      );
    };

    const onFileDrop = (e: DragEvent) => {
      dragState.value = e.type;
      if (e.type === 'drop') {
        props.onDrop?.(e);
      }
    };

    const onFilePaste = async (e: ClipboardEvent) => {
      if (!props.pastable || mergedDisabled.value) return;
      const clipboardFiles: File[] = [];
      if (e.clipboardData?.files?.length) {
        clipboardFiles.push(...Array.from(e.clipboardData.files));
      } else if (e.clipboardData?.items?.length) {
        Array.from(e.clipboardData.items).forEach(item => {
          if (item.kind === 'file') {
            const f = item.getAsFile();
            if (f) clipboardFiles.push(f);
          }
        });
      }
      if (!clipboardFiles.length) return;
      const selectedFiles = props.multiple ? clipboardFiles : clipboardFiles.slice(0, 1);
      const rcFiles = selectedFiles.map(f => {
        const rcFile = f as FileType;
        rcFile.uid = getUid();
        return rcFile;
      });
      const processed = await Promise.all(
        rcFiles.map(async origin => {
          let parsed: any = origin;
          try {
            const res = await mergedBeforeUpload(origin, rcFiles);
            if (res === false) {
              return { file: origin, parsedFile: null as FileType | null };
            }
            if (res) parsed = res;
          } catch {
            return { file: origin, parsedFile: null as FileType | null };
          }
          const parsedFile = (
            parsed instanceof File ? parsed : new File([parsed], origin.name, { type: origin.type })
          ) as FileType;
          parsedFile.uid = origin.uid;
          return { file: origin, parsedFile };
        }),
      );
      onBatchStart(processed as any);
      const requestFn =
        props.customRequest || (uploadConfig.value as any)?.customRequest || defaultRequest;
      for (const item of processed) {
        if (!item.parsedFile) continue;
        const resolvedAction =
          typeof props.action === 'function' ? await props.action(item.parsedFile) : props.action;
        const resolvedData =
          typeof props.data === 'function' ? await props.data(item.parsedFile as any) : props.data;
        requestFn({
          action: resolvedAction,
          filename: props.name || 'file',
          data: resolvedData,
          file: item.parsedFile,
          headers: props.headers,
          withCredentials: props.withCredentials,
          method: props.method || 'post',
          onProgress: (ev: any) => onProgress(ev, item.parsedFile!),
          onSuccess: (ret: any, xhr: any) => onSuccess(ret, item.parsedFile!, xhr),
          onError: (err: any, ret: any) => onError(err, ret, item.parsedFile!),
        });
      }
    };

    expose({
      onBatchStart,
      onSuccess,
      onProgress,
      onError,
      fileList: mergedFileList,
      upload,
    });

    const [locale] = useLocaleReceiver(
      'Upload',
      defaultLocale.Upload,
      computed(() => props.locale),
    );
    const renderUploadList = (
      semanticClassNames: UploadSemanticClassNames,
      semanticStyles: UploadSemanticStyles,
      button?: () => VueNode,
      buttonVisible?: boolean,
    ) => {
      const {
        removeIcon,
        previewIcon,
        downloadIcon,
        previewFile,
        onPreview,
        onDownload,
        isImageUrl,
        progress,
        itemRender,
        iconRender,
        showUploadList,
        extra,
      } = props;
      const {
        showDownloadIcon,
        showPreviewIcon,
        showRemoveIcon,
        removeIcon: showUploadListRemoveIcon,
        previewIcon: showUploadListPreviewIcon,
        downloadIcon: showUploadListDownloadIcon,
        extra: showUploadListExtra,
      } = typeof showUploadList === 'boolean' ? ({} as ShowUploadListInterface) : showUploadList;
      const mergedExtra = showUploadListExtra ?? extra;
      const mergedProgress =
        (uploadConfig.value as any)?.progress || progress
          ? { ...(uploadConfig.value as any)?.progress, ...progress }
          : undefined;
      const realShowRemoveIcon =
        typeof showRemoveIcon === 'undefined' ? !mergedDisabled.value : showRemoveIcon;
      return showUploadList ? (
        <UploadList
          classNames={semanticClassNames}
          styles={semanticStyles}
          prefixCls={prefixCls.value}
          listType={props.listType}
          items={mergedFileList.value}
          previewFile={previewFile}
          onPreview={onPreview}
          onDownload={onDownload}
          onRemove={handleRemove}
          showRemoveIcon={realShowRemoveIcon}
          showPreviewIcon={showPreviewIcon}
          showDownloadIcon={showDownloadIcon}
          removeIcon={showUploadListRemoveIcon ?? removeIcon}
          previewIcon={showUploadListPreviewIcon ?? previewIcon}
          downloadIcon={showUploadListDownloadIcon ?? downloadIcon}
          iconRender={iconRender}
          locale={locale.value}
          isImageUrl={isImageUrl}
          progress={mergedProgress}
          itemRender={itemRender}
          extra={mergedExtra}
          disabled={mergedDisabled.value}
          appendActionVisible={buttonVisible}
          appendAction={button}
          v-slots={{ ...slots }}
        />
      ) : (
        button?.()
      );
    };
    return () => {
      const { listType, type } = props;
      const { class: className, style: styleName, ...transAttrs } = attrs;

      const mergedPropsForSemantic: UploadProps = {
        ...props,
        disabled: mergedDisabled.value,
      };
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        UploadSemanticClassNames,
        UploadSemanticStyles,
        UploadProps
      >([contextClassNames.value, props.classNames], [contextStyles.value, props.styles], {
        props: mergedPropsForSemantic,
      });

      const mergedRootStyle =
        contextStyle.value || mergedStyles.root
          ? [contextStyle.value, mergedStyles.root, styleName]
          : styleName;
      const mergedCustomRequest = props.customRequest || (uploadConfig.value as any)?.customRequest;
      const mergedAccept = props.accept || (uploadConfig.value as any)?.accept || '';

      const rcUploadProps = {
        onBatchStart,
        onError,
        onProgress,
        onSuccess,
        ...transAttrs,
        ...(props as RcUploadProps),
        customRequest: mergedCustomRequest,
        accept: mergedAccept,
        id: props.id ?? formItemContext.id.value,
        prefixCls: prefixCls.value,
        beforeUpload: mergedBeforeUpload,
        onChange: undefined,
        disabled: mergedDisabled.value,
      };
      delete (rcUploadProps as any).remove;
      delete (rcUploadProps as any).classNames;
      delete (rcUploadProps as any).styles;
      delete (rcUploadProps as any).pastable;

      // Remove id to avoid open by label when trigger is hidden
      // !children: https://github.com/ant-design/ant-design/issues/14298
      // disabled: https://github.com/ant-design/ant-design/issues/16478
      //           https://github.com/ant-design/ant-design/issues/24197
      if (!slots.default || mergedDisabled.value) {
        delete rcUploadProps.id;
      }

      const rtlCls = {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      };

      const pasteProps = props.pastable ? { onPaste: onFilePaste } : {};

      if (type === 'drag') {
        const dragCls = classNames(
          prefixCls.value,
          {
            [`${prefixCls.value}-drag`]: true,
            [`${prefixCls.value}-drag-uploading`]: mergedFileList.value.some(
              file => file.status === 'uploading',
            ),
            [`${prefixCls.value}-drag-hover`]: dragState.value === 'dragover',
            [`${prefixCls.value}-disabled`]: mergedDisabled.value,
            [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          },
          mergedClassNames.trigger,
          attrs.class,
          hashId.value,
        );
        const dragStyle =
          mergedStyles.trigger || attrs.style
            ? [mergedStyles.trigger, attrs.style as CSSProperties]
            : undefined;

        return wrapSSR(
          <span
            {...attrs}
            {...pasteProps}
            style={mergedRootStyle as any}
            class={classNames(
              `${prefixCls.value}-wrapper`,
              contextClassName.value,
              mergedClassNames.root,
              props.rootClassName,
              rtlCls,
              className,
              hashId.value,
            )}
          >
            <div
              class={dragCls}
              onDrop={onFileDrop}
              onDragover={onFileDrop}
              onDragleave={onFileDrop}
              style={dragStyle as any}
            >
              <VcUpload
                {...rcUploadProps}
                ref={upload}
                class={`${prefixCls.value}-btn`}
                v-slots={slots}
              >
                <div class={`${prefixCls.value}-drag-container`}>{slots.default?.()}</div>
              </VcUpload>
            </div>
            {renderUploadList(mergedClassNames, mergedStyles)}
          </span>,
        );
      }

      const uploadButtonCls = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-select`]: true,
          [`${prefixCls.value}-select-${listType}`]: true,
          [`${prefixCls.value}-disabled`]: mergedDisabled.value,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        mergedClassNames.trigger,
      );
      const children = flattenChildren(slots.default?.());
      const renderUploadButton = (uploadButtonStyle?: CSSProperties) => {
        const mergedTriggerStyle =
          mergedStyles.trigger || uploadButtonStyle
            ? { ...mergedStyles.trigger, ...uploadButtonStyle }
            : undefined;
        return (
          <div class={uploadButtonCls} style={mergedTriggerStyle}>
            <VcUpload {...rcUploadProps} ref={upload} v-slots={slots} />
          </div>
        );
      };

      if (listType === 'picture-card' || listType === 'picture-circle') {
        return wrapSSR(
          <span
            {...attrs}
            {...pasteProps}
            style={mergedRootStyle as any}
            class={classNames(
              `${prefixCls.value}-wrapper`,
              contextClassName.value,
              mergedClassNames.root,
              props.rootClassName,
              {
                [`${prefixCls.value}-picture-card-wrapper`]: listType === 'picture-card',
                [`${prefixCls.value}-picture-circle-wrapper`]: listType === 'picture-circle',
              },
              rtlCls,
              attrs.class,
              hashId.value,
            )}
          >
            {renderUploadList(
              mergedClassNames,
              mergedStyles,
              renderUploadButton,
              !!(children && children.length),
            )}
          </span>,
        );
      }
      return wrapSSR(
        <span
          {...attrs}
          {...pasteProps}
          style={mergedRootStyle as any}
          class={classNames(
            `${prefixCls.value}-wrapper`,
            contextClassName.value,
            mergedClassNames.root,
            props.rootClassName,
            rtlCls,
            attrs.class,
            hashId.value,
          )}
        >
          {renderUploadButton(children && children.length ? undefined : { display: 'none' })}
          {renderUploadList(mergedClassNames, mergedStyles)}
        </span>,
      );
    };
  },
});
