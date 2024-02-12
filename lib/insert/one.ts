import { DatabaseError } from '../error/error';
import { databaseEventEmitter } from '../events/events';
import { convertRecordToArray } from '../record-converter/record-converter';
import type { TableData, DatabaseRecord } from '../types/database';
import type { InsertOne } from '../types/insert';

export const insertOne = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): InsertOne<Rec> => {
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);

  return record => {
    let exists: boolean;

    if (tableData.index) exists = record.id in tableData.index;
    else exists = !!tableData.records.find(([id]) => id === record.id);

    if (!exists)
      tableData.records.push(convertRecordToArray(tableData.fields)(record));

    if (tableData.index)
      tableData.index[record.id as Rec['id']] = tableData.records.length - 1;

    notifyObservers(
      ['insert', 'one'],
      {
        isFetching: false,
        isSuccess: !exists,
        isEmpty: tableData.records.length === 0
      },
      [record]
    );

    return {
      data: null,
      error: exists
        ? new DatabaseError(
            'EXISTS',
            `Record '${record.id}' already exists in '${tableData.name}'.`
          )
        : null
    };
  };
};
