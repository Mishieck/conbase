import type { TableData, DatabaseRecord, DeleteMany } from '../types/database';
import { deleteOne } from './one';

export const deleteMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): DeleteMany<Rec> => {
  const remove = deleteOne(tableData);

  return (...ids) => {
    const results = ids.map(remove);
    const maybeError = results.find(({ error }) => error)?.error;
    return { data: null, error: maybeError ?? null };
  };
};
