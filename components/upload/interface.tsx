import type {
  RcFile as OriRcFile,
  UploadRequestOption as RcCustomRequestOptions,
} from '../vc-upload/interface';
import type { ProgressProps } from '../progress';
import type { ExtractPropTypes, CSSProperties, ImgHTMLAttributes, PropType } from 'vue';
import type { VueNode } from '../_util/type';
import {
  anyType,
  booleanType,
  stringType,
  functionType,
  arrayType,
  objectType,
  someType,
} from '../_util/type';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';

export type UploadSemanticName = 'root' | 'list' | 'item' | 'trigger';
export type UploadSemanticClassNames = SemanticClassNames<UploadSemanticName>;
export type UploadSemanticStyles = SemanticStyles<UploadSemanticName>;
export type UploadClassNamesType =
  | UploadSemanticClassNames
  | ((info: { props: UploadProps }) => UploadSemanticClassNames);
export type UploadStylesType =
  | UploadSemanticStyles
  | ((info: { props: UploadProps }) => UploadSemanticStyles);

export interface FileType extends OriRcFile {
  readonly lastModifiedDate: Date;
}

export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

export interface HttpRequestHeader {
  [key: string]: string;
}

export interface UploadFile<T = any> {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  crossOrigin?: ImgHTMLAttributes['crossorigin'];
  originFileObj?: FileType;
  response?: T;
  error?: any;
  linkProps?: any;
  type?: string;
  xhr?: T;
  preview?: string;
}

export interface InternalUploadFile<T = any> extends UploadFile<T> {
  originFileObj: FileType;
}

export interface ShowUploadListInterface<T = any> {
  showRemoveIcon?: boolean | ((file: UploadFile<T>) => boolean);
  showPreviewIcon?: boolean | ((file: UploadFile<T>) => boolean);
  showDownloadIcon?: boolean | ((file: UploadFile<T>) => boolean);
  removeIcon?: VueNode | ((opt: { file: UploadFile<T> }) => VueNode);
  downloadIcon?: VueNode | ((opt: { file: UploadFile<T> }) => VueNode);
  previewIcon?: VueNode | ((opt: { file: UploadFile<T> }) => VueNode);
  extra?: VueNode | ((file: UploadFile<T>) => VueNode);
}

export interface UploadChangeParam<T = UploadFile> {
  // https://github.com/ant-design/ant-design/issues/14420
  file: T;
  fileList: T[];
  event?: { percent: number };
}

export interface UploadLocale {
  uploading?: string;
  removeFile?: string;
  downloadFile?: string;
  uploadError?: string;
  previewFile?: string;
}

export type UploadType = 'drag' | 'select';
export type UploadListType = 'text' | 'picture' | 'picture-card' | 'picture-circle';
export type UploadListProgressProps = Omit<ProgressProps, 'percent' | 'type'> & {
  class?: string;
  style?: CSSProperties;
};

export type ItemRender<T = any> = (opt: {
  originNode: VueNode;
  file: UploadFile;
  fileList: Array<UploadFile<T>>;
  actions: {
    download: () => void;
    preview: () => void;
    remove: () => void;
  };
}) => VueNode;

type PreviewFileHandler = (file: FileType | Blob) => PromiseLike<string>;
type TransformFileHandler = (
  file: FileType,
) => string | Blob | FileType | PromiseLike<string | Blob | FileType>;
type BeforeUploadValueType = void | boolean | string | Blob | FileType;

function uploadProps<T = any>() {
  return {
    rootClassName: String,
    classNames: {
      type: [Object, Function] as PropType<UploadClassNamesType>,
      default: undefined,
    },
    styles: {
      type: [Object, Function] as PropType<UploadStylesType>,
      default: undefined,
    },
    pastable: booleanType(),
    extra: anyType<VueNode | ((file: UploadFile<T>) => VueNode)>(),
    capture: someType<boolean | 'user' | 'environment'>([Boolean, String]),
    type: stringType<UploadType>(),
    name: String,
    defaultFileList: arrayType<Array<UploadFile<T>>>(),
    fileList: arrayType<Array<UploadFile<T>>>(),
    action: someType<
      string | ((file: FileType) => string) | ((file: FileType) => PromiseLike<string>)
    >([String, Function]),
    directory: booleanType(),
    data: someType<
      | Record<string, unknown>
      | ((file: UploadFile<T>) => Record<string, unknown> | Promise<Record<string, unknown>>)
    >([Object, Function]),
    method: stringType<'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch'>(),
    headers: objectType<HttpRequestHeader>(),
    showUploadList: someType<boolean | ShowUploadListInterface>([Boolean, Object]),
    multiple: booleanType(),
    accept: String,
    beforeUpload:
      functionType<
        (
          file: FileType,
          FileList: FileType[],
        ) => BeforeUploadValueType | Promise<BeforeUploadValueType>
      >(),
    onChange: functionType<(info: UploadChangeParam<UploadFile<T>>) => void>(),
    'onUpdate:fileList':
      functionType<(fileList: UploadChangeParam<UploadFile<T>>['fileList']) => void>(),
    onDrop: functionType<(event: DragEvent) => void>(),
    listType: stringType<UploadListType>(),
    onPreview: functionType<(file: UploadFile<T>) => void>(),
    onDownload: functionType<(file: UploadFile<T>) => void>(),
    onReject: functionType<(fileList: FileType[]) => void>(),
    onRemove: functionType<(file: UploadFile<T>) => void | boolean | Promise<void | boolean>>(),
    /** @deprecated Please use `onRemove` directly */
    remove: functionType<(file: UploadFile<T>) => void | boolean | Promise<void | boolean>>(),
    supportServerRender: booleanType(),
    disabled: booleanType(),
    prefixCls: String,
    customRequest: functionType<(options: RcCustomRequestOptions) => void>(),
    withCredentials: booleanType(),
    openFileDialogOnClick: booleanType(),
    locale: objectType<UploadLocale>(),
    id: String,
    previewFile: functionType<PreviewFileHandler>(),
    /** @deprecated Please use `beforeUpload` directly */
    transformFile: functionType<TransformFileHandler>(),
    iconRender:
      functionType<(opt: { file: UploadFile<T>; listType?: UploadListType }) => VueNode>(),
    isImageUrl: functionType<(file: UploadFile) => boolean>(),
    progress: objectType<UploadListProgressProps>(),
    itemRender: functionType<ItemRender<T>>(),
    /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
    maxCount: Number,
    height: someType([Number, String]),
    removeIcon: functionType<(opt: { file: UploadFile }) => VueNode>(),
    downloadIcon: functionType<(opt: { file: UploadFile }) => VueNode>(),
    previewIcon: functionType<(opt: { file: UploadFile }) => VueNode>(),
  };
}

export type UploadProps = Partial<ExtractPropTypes<ReturnType<typeof uploadProps>>>;

export interface UploadState<T = any> {
  fileList: UploadFile<T>[];
  dragState: string;
}

function uploadListProps<T = any>() {
  return {
    classNames: objectType<UploadSemanticClassNames>(),
    styles: objectType<UploadSemanticStyles>(),
    listType: stringType<UploadListType>(),
    onPreview: functionType<(file: UploadFile<T>) => void>(),
    onDownload: functionType<(file: UploadFile<T>) => void>(),
    onRemove: functionType<(file: UploadFile<T>) => void | boolean>(),
    items: arrayType<Array<UploadFile<T>>>(),
    progress: objectType<UploadListProgressProps>(),
    prefixCls: stringType<string>(),
    showRemoveIcon: someType<boolean | ((file: UploadFile<T>) => boolean)>([Boolean, Function]),
    showDownloadIcon: someType<boolean | ((file: UploadFile<T>) => boolean)>([Boolean, Function]),
    showPreviewIcon: someType<boolean | ((file: UploadFile<T>) => boolean)>([Boolean, Function]),
    removeIcon: anyType<VueNode | ((opt: { file: UploadFile }) => VueNode)>(),
    downloadIcon: anyType<VueNode | ((opt: { file: UploadFile }) => VueNode)>(),
    previewIcon: anyType<VueNode | ((opt: { file: UploadFile }) => VueNode)>(),
    locale: objectType<UploadLocale>(undefined as UploadLocale),
    previewFile: functionType<PreviewFileHandler>(),
    iconRender:
      functionType<(opt: { file: UploadFile<T>; listType?: UploadListType }) => VueNode>(),
    isImageUrl: functionType<(file: UploadFile) => boolean>(),
    appendAction: functionType<() => VueNode>(),
    appendActionVisible: booleanType(),
    itemRender: functionType<ItemRender<T>>(),
    extra: anyType<VueNode | ((file: UploadFile<T>) => VueNode)>(),
    disabled: booleanType(),
  };
}

export type UploadListProps = Partial<ExtractPropTypes<ReturnType<typeof uploadListProps>>>;
export { uploadProps, uploadListProps };
