import type {
  TableData,
  DatabaseRecord,
  DatabaseResult
} from '../types/database';
import type { SelectMany } from '../types/select';
import { selectOne } from './one';

export const selectMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): SelectMany<Rec> => {
  const select = selectOne(tableData);

  return (...ids) => {
    const results = ids.map<DatabaseResult<Rec>>(select);
    const error = results.find(({ error }) => error)?.error ?? null;

    return {
      data: error ? null : results.map(({ data }) => data as Rec),
      error: error
    };
  };
};
