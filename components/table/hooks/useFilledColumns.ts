import type { Ref } from 'vue';
import { computed, toRaw } from 'vue';
import { EXPAND_COLUMN } from '../../vc-table';
import omit from '../../_util/omit';
import type { ColumnGroupType, ColumnsType, ColumnType } from '../interface';
import { SELECTION_COLUMN } from './useSelection';

function mergeColumnDefaults<T extends Record<string, any>>(
  defaults: Partial<T>,
  col: Partial<T>,
): T {
  const result: Record<string, any> = { ...defaults };
  Object.keys(col).forEach(key => {
    if (col[key] !== undefined) {
      result[key] = col[key];
    }
  });
  return result as T;
}

export default function useFilledColumns<RecordType = any>(
  columnsRef: Ref<ColumnsType<RecordType>>,
  columnRef: Ref<Partial<ColumnType<RecordType>> | undefined>,
) {
  return computed<ColumnsType<RecordType>>(() => {
    const columns = columnsRef.value || [];
    const column = columnRef.value;

    if (!column) {
      return columns;
    }

    const fillColumns = (currentColumns: ColumnsType<RecordType>): ColumnsType<RecordType> =>
      currentColumns.map(col => {
        const rawCol = toRaw(col);
        if (!col || rawCol === SELECTION_COLUMN || rawCol === EXPAND_COLUMN) {
          return rawCol;
        }

        if ('children' in col && Array.isArray((col as ColumnGroupType<RecordType>).children)) {
          const groupCol = col as ColumnGroupType<RecordType>;
          const mergedColumn = mergeColumnDefaults<ColumnGroupType<RecordType>>(
            column as Partial<ColumnGroupType<RecordType>>,
            groupCol,
          );

          return {
            ...mergedColumn,
            children: fillColumns(groupCol.children),
          };
        }

        const columnWithoutChildren = omit(column as any, ['children']) as Partial<
          ColumnType<RecordType>
        >;

        return mergeColumnDefaults<ColumnType<RecordType>>(
          columnWithoutChildren,
          col as Partial<ColumnType<RecordType>>,
        );
      });

    return fillColumns(columns);
  });
}
