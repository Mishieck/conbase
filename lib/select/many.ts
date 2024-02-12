import type { TableData, DatabaseRecord, SelectMany } from '../types/database';
import { selectOne } from './one';

export const selectMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): SelectMany<Rec> => {
  const select = selectOne(tableData);

  return (...ids) => {
    const results = ids.map(select);
    const error = results.find(({ error }) => error)?.error ?? null;

    return {
      data: error ? null : results.map(({ data }) => data as Rec),
      error: error
    };
  };
};
