import { DatabaseError } from '../error/error';
import { databaseEventEmitter } from '../events/events';
import { convertArrayToRecord } from '../record-converter/record-converter';
import type { TableData, DatabaseRecord } from '../types/database';
import type { UpdateOne } from '../types/update';

export const updateOne = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): UpdateOne<Rec> => {
  const convertToRecord = convertArrayToRecord<Rec>(tableData.fields);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers = (data: Rec) => {
    notifyObservers(
      ['update', 'one'],
      {
        isFetching: false,
        isSuccess: true,
        isEmpty: tableData.records.length === 0
      },
      [data]
    );

    observers['update-one']?.forEach(notify => notify(data));
    observers['update']?.forEach(notify => notify([data]));
  };


  return (update, emitEvent = true) => {
    const record = tableData.records.find(
      rec => rec[tableData.fields.id] === update.id
    );

    if (!record) {
      return {
        data: null,
        error: new DatabaseError(
          'NOT-EXISTS',
          `Couldn't find record ${update.id}`
        )
      };
    }

    for (const field in update)
      record[tableData.fields[field as keyof Rec]] = update[field as keyof Rec];

    const data = convertToRecord(record);
    if (emitEvent) notifyEventObservers(data);
    tableData.latestOperation = 'update';
    return { data, error: null };
  };
};

