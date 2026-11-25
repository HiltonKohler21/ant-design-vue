import type { DataNode, FieldNames, Key } from '../../vc-tree/interface';

enum Record {
  None,
  Start,
  End,
}

function traverseNodesKey(
  treeData: DataNode[],
  fieldNames: FieldNames,
  callback: (key: Key | number | null, node: DataNode) => boolean,
) {
  function processNode(dataNode: DataNode) {
    const key = dataNode[fieldNames.key];
    const children = dataNode[fieldNames.children];
    if (callback(key, dataNode) !== false) {
      traverseNodesKey(children || [], fieldNames, callback);
    }
  }

  treeData.forEach(processNode);
}

/** 计算选中范围，只考虑expanded情况以优化性能 */
export function calcRangeKeys({
  treeData,
  expandedKeys,
  startKey,
  endKey,
  fieldNames = {
    title: 'title',
    key: 'key',
    children: 'children',
  },
}: {
  treeData: DataNode[];
  expandedKeys: Key[];
  startKey?: Key;
  endKey?: Key;
  fieldNames?: FieldNames;
}): Key[] {
  const keys: Key[] = [];
  let record: Record = Record.None;

  if (startKey && startKey === endKey) {
    return [startKey];
  }
  if (!startKey || !endKey) {
    return [];
  }

  const expandedKeySet = new Set(expandedKeys);

  function matchKey(key: Key) {
    return key === startKey || key === endKey;
  }

  traverseNodesKey(treeData, fieldNames, (key: Key) => {
    if (record === Record.End) {
      return false;
    }

    if (matchKey(key)) {
      // Match test
      keys.push(key);

      if (record === Record.None) {
        record = Record.Start;
      } else if (record === Record.Start) {
        record = Record.End;
        return false;
      }
    } else if (record === Record.Start) {
      // Append selection
      keys.push(key);
    }

    return expandedKeySet.has(key);
  });

  return keys;
}

export function convertDirectoryKeysToNodes(
  treeData: DataNode[],
  keys: Key[],
  fieldNames: FieldNames = {
    title: 'title',
    key: 'key',
    children: 'children',
  },
) {
  const restKeys = new Set(keys);
  const nodes: DataNode[] = [];
  traverseNodesKey(treeData, fieldNames, (key: Key, node: DataNode) => {
    if (key !== null && restKeys.delete(key)) {
      nodes.push(node);
    }

    return restKeys.size > 0;
  });
  return nodes;
}
