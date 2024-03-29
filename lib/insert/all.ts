import { databaseEventEmitter } from '../events/events';
import { convertArrayToRecord } from '../record-converter/record-converter';
import type { TableData, DatabaseRecord } from '../types/database';
import type { InsertAll } from '../types/insert';
import { insertOne } from './one';

export const insertAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): InsertAll<Rec> => {
  const insert = insertOne(tableData);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const convertToRecord = convertArrayToRecord(tableData.fields);

  return records => {
    console.log('record length', records.length);
    for (const record of records) insert(record, false);

    notifyObservers(
      ['insert', 'all'],
      {
        isFetching: false,
        isSuccess: true,
        isEmpty: tableData.records.length === 0
      },
      records
    );

    tableData.latestOperation = 'insert';
    return { data: records, error: null };
  };
};
