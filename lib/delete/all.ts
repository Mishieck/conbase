import type { TableData, DatabaseRecord, DeleteAll } from '../types/database';

export const deleteAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): DeleteAll => {
  return () => {
    tableData.records = [];
    return { data: null, error: null };
  };
};
