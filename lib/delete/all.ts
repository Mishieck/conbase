import { databaseEventEmitter } from '../events/events';
import type { TableData, DatabaseRecord } from '../types/database';
import type { DeleteAll } from '../types/delete';

export const deleteAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): DeleteAll => {
  const notifyObservers = databaseEventEmitter.notifyObservers(tableData);

  return () => {
    tableData.records = [];

    notifyObservers(
      ['delete', 'all'],
      {
        isFetching: false,
        isSuccess: true,
        isEmpty: tableData.records.length === 0
      },
      null
    );

    return { data: null, error: null };
  };
};
