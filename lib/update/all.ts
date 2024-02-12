import { databaseEventEmitter } from '../events/events';
import {
  convertArrayToRecord,
  convertRecordToArray
} from '../record-converter/record-converter';
import type { TableData, DatabaseRecord } from '../types/database';
import type { UpdateAll } from '../types/update';

export const updateAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): UpdateAll<Rec> => {
  const convertToRecord = convertArrayToRecord(tableData.fields);
  const convertToArray = convertRecordToArray(tableData.fields);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);

  return update => {
    tableData.records = tableData.records.map(record =>
      convertToArray(update(convertToRecord(record)))
    );

    const data = tableData.records.map(convertToRecord);

    notifyObservers(
      ['update', 'all'],
      {
        isFetching: false,
        isSuccess: true,
        isEmpty: tableData.records.length === 0
      },
      data
    );

    return {
      data,
      error: null
    };
  };
};
