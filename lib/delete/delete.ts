import type { TableData, DatabaseRecord, Delete } from '../types/database';
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
