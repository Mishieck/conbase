import { databaseEventEmitter } from '../events/events';
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
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);

  return (...ids) => {
    const results = ids.map<DatabaseResult<Rec>>(select);
    const error = results.find(({ error }) => error)?.error ?? null;

    const data = error ? null : results.map(({ data }) => data as Rec);

    notifyObservers(
      ['select', 'many'],
      {
        isFetching: false,
        isSuccess: !error,
        isEmpty: tableData.records.length === 0
      },
      data
    );

    return {
      data,
      error: error
    };
  };
};
