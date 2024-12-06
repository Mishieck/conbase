import { DatabaseError } from "../error/error.ts";
import { databaseEventEmitter } from "../events/events.ts";
import { convertRecordToArray } from "../record-converter/record-converter.ts";
import type { DatabaseRecord, TableData } from "../types/database.ts";
import type { InsertOne } from "../types/insert.ts";

export const insertOne = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>,
): InsertOne<Rec> => {
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers = (record: Rec, exists: boolean) => {
    notifyObservers(
      ["insert", "one"],
      {
        isFetching: false,
        isSuccess: !exists,
        isEmpty: tableData.records.length === 0,
      },
      [record],
    );

    observers["insert-one"]?.forEach((notify) => notify(record));
    observers["insert"]?.forEach((notify) => notify([record]));
  };

  return (record, emitEvent = true) => {
    let exists: boolean;

    if (tableData.index) exists = record.id in tableData.index;
    else exists = !!tableData.records.find(([id]) => id === record.id);

    if (!exists) {
      tableData.records.push(convertRecordToArray(tableData.fields)(record));
    }

    if (tableData.index) {
      tableData.index[record.id as Rec["id"]] = tableData.records.length - 1;
    }

    if (emitEvent) notifyEventObservers(record, exists);
    tableData.latestOperation = "insert";

    return {
      data: null,
      error: exists
        ? new DatabaseError(
          "EXISTS",
          `Record '${record.id}' already exists in '${tableData.name}'.`,
        )
        : null,
    };
  };
};
