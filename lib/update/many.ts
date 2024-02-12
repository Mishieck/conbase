import type { TableData, DatabaseRecord, UpdateMany } from '../types/database';
import { updateOne } from './one';

export const updateMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): UpdateMany<Rec> => {
  const update = updateOne(tableData);

  return (...updates) => {
    const results = updates.map(update);
    const maybeError = results.find(({ error }) => !!error);

    return {
      data: maybeError
        ? null
        : results.filter(({ error }) => !error).map(({ data }) => data as Rec),
      error: maybeError
        ? results.find(({ error }) => error)?.error ?? null
        : null
    };
  };
};
