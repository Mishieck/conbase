import { DatabaseError } from '../error/error';
import { databaseEventEmitter } from '../events/events';
import { selectOne } from '../select/one';
import type { TableData, DatabaseRecord } from '../types/database';
import type { DeleteOne } from '../types/delete';

export const deleteOne = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): DeleteOne<Rec> => {
  const notifyObservers = databaseEventEmitter.notifyObservers(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers = (data: Rec, indexOfRecord: number) => {
    notifyObservers(
      ['delete', 'one'],
      {
        isFetching: false,
        isSuccess: indexOfRecord >= 0,
        isEmpty: tableData.records.length === 0
      },
      null
    );

    observers['delete-one']?.forEach(notify => notify(data));
    observers['delete']?.forEach(notify => notify([data]));
  };

  return (id, emitEvent = true) => {
    const idIndex = tableData.fields.id;

    const indexOfRecord = tableData.records.findIndex(
      rec => rec[idIndex] === id
    );

    const record = selectOne(tableData)(id, false).data;
    if (indexOfRecord >= 0) tableData.records.splice(indexOfRecord, 1);
    if (emitEvent && record) notifyEventObservers(record, indexOfRecord);
    tableData.latestOperation = 'delete';

    return {
      data: null,
      error:
        indexOfRecord < 0
          ? new DatabaseError('NOT-EXISTS', `Couldn't find record ${id}`)
          : null
    };
  };
};
