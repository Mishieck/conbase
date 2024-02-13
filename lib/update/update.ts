import type { TableData, DatabaseRecord } from '../types/database';
import type { Update } from '../types/update';
import { updateAll } from './all';
import { updateMany } from './many';
import { updateOne } from './one';

export const Updater = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): Update<Rec> => ({
  one: updateOne(tableData),
  many: updateMany(tableData),
  all: updateAll(tableData)
});

export * from './all';
export * from './one';
export * from './many';
