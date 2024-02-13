import type { TableData, DatabaseRecord } from '../types/database';
import type { Delete } from '../types/delete';
import { deleteAll } from './all';
import { deleteMany } from './many';
import { deleteOne } from './one';

export const Remover = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): Delete<Rec> => ({
  one: deleteOne(tableData),
  many: deleteMany(tableData),
  all: deleteAll(tableData)
});

export * from './all';
export * from './one';
export * from './many';
