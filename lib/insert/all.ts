import { databaseEventEmitter } from '../events/events';
import type { TableData, DatabaseRecord } from '../types/database';
import type { InsertAll } from '../types/insert';
import { insertOne } from './one';

export const insertAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): InsertAll<Rec> => {
  const insert = insertOne(tableData);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers = (records: Array<Rec>) => {
    notifyObservers(
      ['insert', 'all'],
      {
        isFetching: false,
        isSuccess: true,
        isEmpty: tableData.records.length === 0
      },
      records
    );

    observers['insert-all']?.forEach(notify => notify(records));
    observers['insert']?.forEach(notify => notify(records));
  };

  return (records, emitEvent = true) => {
    for (const record of records) insert(record, false);
    if (emitEvent) notifyEventObservers(records);
    tableData.latestOperation = 'insert';
    return { data: records, error: null };
  };
};
