import type {
  TableData,
  DatabaseRecord,
  DatabaseResult
} from '../types/database';
import type { UpdateMany } from '../types/update';
import { updateOne } from './one';

export const updateMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): UpdateMany<Rec> => {
  const update = updateOne(tableData);

  return (...updates) => {
    const results = updates.map<DatabaseResult<Rec>>(update);
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
