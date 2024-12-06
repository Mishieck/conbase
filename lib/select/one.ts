import { DatabaseError } from "../error/error.ts";
import { databaseEventEmitter } from "../events/events.ts";
import { convertArrayToRecord } from "../record-converter/record-converter.ts";
import type { DatabaseRecord, TableData } from "../types/database.ts";
import type { SelectOne } from "../types/select.ts";

export const selectOne = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>,
): SelectOne<Rec> => {
  const convert = convertArrayToRecord<Rec>(tableData.fields);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers = (record: Rec) => {
    notifyObservers(
      ["select", "one"],
      {
        isFetching: false,
        isSuccess: !!record,
        isEmpty: tableData.records.length === 0,
      },
      record ? [record] : null,
    );

    observers["select-one"]?.forEach((notify) => notify(record));
    observers["select"]?.forEach((notify) => notify([record]));
  };

  return (id, emitEvent = true) => {
    const record = tableData.index
      ? tableData.records[tableData.index[id]]
      : tableData.records.find((record) => record[0] === id);

    const data = record ? convert(record) : null;
    if (emitEvent && data) notifyEventObservers(data);

    return {
      data,
      error: data ? null : new DatabaseError(
        "NOT-EXISTS",
        `Record "${id}" not found in "${tableData.name}".`,
      ),
    };
  };
};
