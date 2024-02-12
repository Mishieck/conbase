import type { TableData, DatabaseRecord, Insert } from '../types/database';
import { insertMany } from './many';
import { insertOne } from './one';

export const Inserter = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): Insert<Rec> => ({
  one: insertOne(tableData),
  many: insertMany(tableData)
});
