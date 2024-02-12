import type { TableData, DatabaseRecord } from '../types/database';
import type { Insert } from '../types/insert';
import { insertMany } from './many';
import { insertOne } from './one';

export const Inserter = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): Insert<Rec> => ({
  one: insertOne(tableData),
  many: insertMany(tableData)
});
