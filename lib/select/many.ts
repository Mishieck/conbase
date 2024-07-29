import type { DatabaseError } from '../error/error';
import { databaseEventEmitter } from '../events/events';
import type {
  TableData,
  DatabaseRecord,
  DatabaseResult,
  Nullable
} from '../types/database';
import type { SelectMany } from '../types/select';
import { selectOne } from './one';

export const selectMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): SelectMany<Rec> => {
  const select = selectOne(tableData);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers =
    (records: Array<Rec>, error: Nullable<DatabaseError>) => {
      notifyObservers(
        ['select', 'many'],
        {
          isFetching: false,
          isSuccess: !error,
          isEmpty: tableData.records.length === 0
        },
        records
      );

      observers['select-many']?.forEach(notify => notify(records));
      observers['select']?.forEach(notify => notify(records));
    };

  return (ids, emitEvent = true) => {
    const results = ids.map<DatabaseResult<Rec>>(id => select(id, false));
    const error = results.find(({ error }) => error)?.error ?? null;
    const data = error ? null : results.map(({ data }) => data as Rec);
    if (emitEvent) notifyEventObservers(data ?? [], error);
    return { data, error };
  };
};

