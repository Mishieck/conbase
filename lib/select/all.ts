import { convertArrayToRecord } from '../record-converter/record-converter';
import type { TableData, DatabaseRecord, SelectAll } from '../types/database';

export const selectAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): SelectAll<Rec> => {
  const convert = convertArrayToRecord<Rec>(tableData.fields);

  return () => {
    return { data: tableData.records.map(convert), error: null };
  };
};
