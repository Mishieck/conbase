import type { TableData, DatabaseRecord } from '../types/database';
import type { InsertAll } from '../types/insert';
import { insertOne } from './one';

export const insertAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): InsertAll<Rec> => {
  const insert = insertOne(tableData);

  return (...records) => {
    console.log('record length', records.length);
    for (const record of records) insert(record);
    return { data: null, error: null };
  };
};
