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

  return (update, emitEvent = true) => {
    const record = tableData.records.find(
      rec => rec[tableData.fields.id] === update.id
    );

    if (!record)
      return {
        data: null,
        error: new DatabaseError(
          'NOT-EXISTS',
          `Couldn't find record ${update.id}`
        )
      };

    for (const field in update)
      record[tableData.fields[field as keyof Rec]] = update[field as keyof Rec];

    const data = convertToRecord(record);

    if (emitEvent) {
      notifyObservers(
        ['update', 'one'],
        {
          isFetching: false,
          isSuccess: true,
          isEmpty: tableData.records.length === 0
        },
        [data]
      );
    }

    return { data, error: null };
  };
};
