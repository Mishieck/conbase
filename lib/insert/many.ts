import { databaseEventEmitter } from '../events/events';
import type { TableData, DatabaseRecord } from '../types/database';
import type { InsertMany } from '../types/insert';
import { insertOne } from './one';

export const insertMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): InsertMany<Rec> => {
  const insert = insertOne(tableData);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers = (data: Array<Rec>) => {
    observers['insert-many']?.forEach(notify => notify(data));
    observers['insert']?.forEach(notify => notify(data));
  };

  return (records, emitEvent = true) => {
    for (const record of records) insert(record, false);

    if (emitEvent) {
      notifyObservers(
        ['insert', 'many'],
        {
          isFetching: false,
          isSuccess: true,
          isEmpty: tableData.records.length === 0
        },
        records
      );

      notifyEventObservers(records);
    }

    tableData.latestOperation = 'insert';
    return { data: null, error: null };
  };
};
