import { databaseEventEmitter } from '../events/events';
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
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);

  return (...updates) => {
    const results = updates.map<DatabaseResult<Rec>>(update);
    const maybeError = results.find(({ error }) => !!error);

    const data = maybeError
      ? null
      : results.filter(({ error }) => !error).map(({ data }) => data as Rec);

    notifyObservers(
      ['update', 'many'],
      {
        isFetching: false,
        isSuccess: !maybeError,
        isEmpty: tableData.records.length === 0
      },
      data
    );

    return {
      data,
      error: maybeError
        ? results.find(({ error }) => error)?.error ?? null
        : null
    };
  };
};
