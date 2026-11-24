import { unref } from 'vue';
import type { MaybeRefOrGetter } from '../_util/hooks/useMergeSemantic';
import type { DataEntity, DataNode, FieldNames, Key } from '../vc-tree/interface';
import { convertDataToEntities, fillFieldNames } from '../vc-tree/utils/treeUtil';

export interface UseTreeConfig {
  fieldNames?: FieldNames;
}

export interface TreeInstance<T extends DataNode = DataNode> {
  getPath: (key: Key) => DataEntity<T>[];
}

function unwrapTreeData<T extends DataNode>(source: MaybeRefOrGetter<T[] | undefined>): T[] {
  const val = typeof source === 'function' ? (source as () => T[] | undefined)() : unref(source);
  return Array.isArray(val) ? val : [];
}

export function useTree<T extends DataNode = DataNode>(
  treeData: MaybeRefOrGetter<T[] | undefined>,
  config: UseTreeConfig = {},
): TreeInstance<T> {
  const getPath = (key: Key): DataEntity<T>[] => {
    const data = unwrapTreeData(treeData);
    if (!data.length) return [];
    const { keyEntities } = convertDataToEntities(data, {
      fieldNames: fillFieldNames(config.fieldNames),
    });
    const path: DataEntity<T>[] = [];
    let current = keyEntities[key] as DataEntity<T> | undefined;
    while (current) {
      path.push(current);
      current = current.parent as DataEntity<T> | undefined;
    }
    return path.reverse();
  };

  return {
    getPath,
  };
}

export default useTree;
