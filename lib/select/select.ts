import type { TableData, DatabaseRecord, Select } from '../types/database';
import { selectAll } from './all';
import { selectMany } from './many';
import { selectOne } from './one';

export const Selector = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): Select<Rec> => ({
  one: selectOne(tableData),
  many: selectMany(tableData),
  all: selectAll(tableData)
});
