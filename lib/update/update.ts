import type { TableData, DatabaseRecord } from '../types/database';
import type { Update } from '../types/update';
import { updateMany } from './many';
import { updateOne } from './one';

export const Updater = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): Update<Rec> => ({
  one: updateOne(tableData),
  many: updateMany(tableData)
});
