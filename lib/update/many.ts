import type { DatabaseError } from '../error/error';
import { databaseEventEmitter } from '../events/events';
import type {
  TableData,
  DatabaseRecord,
  DatabaseResult,
  Nullable
} from '../types/database';
import type { UpdateMany } from '../types/update';
import { updateOne } from './one';

export const updateMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): UpdateMany<Rec> => {
  const update = updateOne(tableData);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers =
    (data: Array<Rec>, maybeError: Nullable<DatabaseError>) => {
      notifyObservers(
        ['update', 'many'],
        {
          isFetching: false,
          isSuccess: !maybeError,
          isEmpty: tableData.records.length === 0
        },
        data
      );

      observers['update-many']?.forEach(notify => notify(data));
      observers['update']?.forEach(notify => notify(data));
    };

  return (updates, emitEvent = true) => {
    const results = updates.map<DatabaseResult<Rec>>(up => update(up, false));
    const maybeError = results.find(({ error }) => !!error)?.error ?? null;

    const data = maybeError
      ? null
      : results.filter(({ error }) => !error).map(({ data }) => data as Rec);

    if (emitEvent) notifyEventObservers(data ?? [], maybeError);
    tableData.latestOperation = 'update';
    return { data, error: maybeError };
  };
};
