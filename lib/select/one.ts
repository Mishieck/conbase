import { DatabaseError } from '../error/error';
import { databaseEventEmitter } from '../events/events';
import { convertArrayToRecord } from '../record-converter/record-converter';
import type { TableData, DatabaseRecord } from '../types/database';
import type { SelectOne } from '../types/select';

export const selectOne = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): SelectOne<Rec> => {
  const convert = convertArrayToRecord<Rec>(tableData.fields);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers = (record: Rec) => {
    notifyObservers(
      ['select', 'one'],
      {
        isFetching: false,
        isSuccess: !!record,
        isEmpty: tableData.records.length === 0
      },
      record ? [record] : null
    );

    observers['select-one']?.forEach(notify => notify(record));
    observers['select']?.forEach(notify => notify([record]));
  };

  return (id, emitEvent = true) => {
    let record = tableData.index
      ? tableData.records[tableData.index[id]]
      : tableData.records.find(record => record[0] === id);

    const data = record ? convert(record) : null;
    if (emitEvent && data) notifyEventObservers(data);

    return {
      data,
      error: record
        ? null
        : new DatabaseError(
          'NOT-EXISTS',
          `Record "${id}" not found in "${tableData.name}".`
        )
    };
  };
};
