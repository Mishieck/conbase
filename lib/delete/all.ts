import type { TableData, DatabaseRecord } from '../types/database';
import type { DeleteAll } from '../types/delete';

export const deleteAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): DeleteAll => {
  return () => {
    tableData.records = [];
    return { data: null, error: null };
  };
};
