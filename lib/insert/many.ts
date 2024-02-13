import { databaseEventEmitter } from '../events/events';
import type { TableData, DatabaseRecord } from '../types/database';
import type { InsertMany } from '../types/insert';
import { insertOne } from './one';

export const insertMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): InsertMany<Rec> => {
  const insert = insertOne(tableData);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);

  return records => {
    console.log('record length', records.length);
    for (const record of records) insert(record, false);

    notifyObservers(
      ['insert', 'many'],
      {
        isFetching: false,
        isSuccess: true,
        isEmpty: tableData.records.length === 0
      },
      records
    );

    return { data: null, error: null };
  };
};
