import { databaseEventEmitter } from "../events/events.ts";
import type { DatabaseRecord, TableData } from "../types/database.ts";
import type { InsertAll } from "../types/insert.ts";
import { insertOne } from "./one.ts";

export const insertAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>,
): InsertAll<Rec> => {
  const insert = insertOne(tableData);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers = (records: Array<Rec>) => {
    notifyObservers(
      ["insert", "all"],
      {
        isFetching: false,
        isSuccess: true,
        isEmpty: tableData.records.length === 0,
      },
      records,
    );

    observers["insert-all"]?.forEach((notify) => notify(records));
    observers["insert"]?.forEach((notify) => notify(records));
  };

  return (records, emitEvent = true) => {
    for (const record of records) insert(record, false);
    if (emitEvent) notifyEventObservers(records);
    tableData.latestOperation = "insert";
    return { data: records, error: null };
  };
};
