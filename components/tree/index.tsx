import type { App } from 'vue';
import Tree from './Tree';
import { TreeNode as VcTreeNode } from '../vc-tree';
import DirectoryTree from './DirectoryTree';
import useTree from './useTree';

export type { EventDataNode, DataNode, DataNode as TreeDataNode } from '../vc-tree/interface';
export type { TreeInstance, UseTreeConfig } from './useTree';

export type {
  TreeProps,
  TreeSemanticName,
  TreeSemanticClassNames,
  TreeSemanticStyles,
  TreeClassNamesType,
  TreeStylesType,
  TreeDraggableFn,
  TreeDraggableConfig,
  AntTreeNodeMouseEvent,
  AntTreeNodeExpandedEvent,
  AntTreeNodeCheckedEvent,
  AntTreeNodeSelectedEvent,
  AntTreeNodeDragEnterEvent,
  AntTreeNodeDropEvent,
  AntdTreeNodeAttribute,
  TreeDataItem,
} from './Tree';

export type {
  ExpandAction as DirectoryTreeExpandAction,
  DirectoryTreeProps,
} from './DirectoryTree';

/* istanbul ignore next */

const TreeNode = VcTreeNode;

export { DirectoryTree, TreeNode, useTree };

export default Object.assign(Tree, {
  DirectoryTree,
  TreeNode,
  useTree,
  install: (app: App) => {
    app.component(Tree.name, Tree);
    app.component(TreeNode.name, TreeNode);
    app.component(DirectoryTree.name, DirectoryTree);
    return app;
  },
});
