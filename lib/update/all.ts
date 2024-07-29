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
  const observers = tableData.eventObservers;

  const notifyEventObservers = (records: Array<Rec>) => {
    notifyObservers(
      ['update', 'all'],
      {
        isFetching: false,
        isSuccess: true,
        isEmpty: tableData.records.length === 0
      },
      records
    );

    observers['update-all']?.forEach(notify => notify(records));
    observers['update']?.forEach(notify => notify(records));
  };

  return (update, emitEvent = true) => {
    tableData.records = tableData
      .records
      .map(record => convertToArray(update(convertToRecord(record))));

    const data = tableData.records.map(convertToRecord);
    if (emitEvent) notifyEventObservers(data);
    tableData.latestOperation = 'update';
    return { data, error: null };
  };
};
