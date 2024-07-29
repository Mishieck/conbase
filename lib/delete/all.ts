import { databaseEventEmitter } from '../events/events';
import { selectAll } from '../select/all';
import type { TableData, DatabaseRecord } from '../types/database';
import type { DeleteAll } from '../types/delete';

export const deleteAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): DeleteAll => {
  const notifyObservers = databaseEventEmitter.notifyObservers(tableData);
  const select = selectAll(tableData)
  const observers = tableData.eventObservers;

  const notifyEventObservers = (records: Array<Rec>) => {
    notifyObservers(
      ['delete', 'all'],
      {
        isFetching: false,
        isSuccess: true,
        isEmpty: tableData.records.length === 0
      },
      null
    );

    observers['delete-all']?.forEach(notify => notify(records));
    observers['delete']?.forEach(notify => notify(records));
  };

  return (emitEvent = true) => {
    const records = select(false).data ?? [];
    tableData.records = [];
    if (emitEvent) notifyEventObservers(records);
    tableData.latestOperation = 'delete';
    return { data: null, error: null };
  };
};
