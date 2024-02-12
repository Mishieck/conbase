import type { TableData, DatabaseRecord, InsertMany } from '../types/database';
import { insertOne } from './one';

export const insertMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): InsertMany<Rec> => {
  const insert = insertOne(tableData);

  return (...records) => {
    console.log('record length', records.length);
    for (const record of records) insert(record);
    return { data: null, error: null };
  };
};
