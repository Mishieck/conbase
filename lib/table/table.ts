import { Remover } from "../delete/delete.ts";
import { databaseEventEmitter } from "../events/events.ts";
import { Fetcher } from "../fetch/fetch.ts";
import { Inserter } from "../insert/insert.ts";
import { Selector } from "../select/select.ts";
import type {
  DatabaseRecord,
  Fields,
  Index,
  TableData,
} from "../types/database.ts";
import type { Table as TableType } from "../types/table.ts";
import { Updater } from "../update/update.ts";

export const createFields = <Rec extends DatabaseRecord>(
  ...fieldNames: Array<keyof Rec>
): Fields<Rec> =>
  fieldNames.reduce(
    (fields, key, i) => ({ ...fields, [key]: i }),
    {} as Fields<Rec>,
  );

export const createTableData = <Rec extends DatabaseRecord>(
  name: string,
  fields: Array<keyof Rec>,
  useIndex: boolean,
): TableData<Rec> => {
  return {
    name,
    fields: createFields(...fields),
    index: useIndex ? ({} as Index<Rec>) : null,
    records: [],
    observers: [],
    eventObservers: {},
  };
};

export const Table = <Rec extends DatabaseRecord>(
  name: string,
  fields: Array<keyof Rec>,
  useIndex: boolean = false,
): TableType<Rec> => {
  const tableData = createTableData(name, fields, useIndex);

  return {
    insert: Inserter(tableData),
    select: Selector(tableData),
    update: Updater(tableData),
    delete: Remover(tableData),
    fetch: Fetcher(tableData),
    add: { observer: databaseEventEmitter.addObserver(tableData) },
    observe: (eventName, observe) => {
      if (!tableData.eventObservers[eventName]) {
        tableData.eventObservers[eventName] = [];
      }
      tableData.eventObservers[eventName]?.push(observe);
    },
    remove: {
      observer: (eventName, observe) => {
        const indexOfObserver = tableData
          .eventObservers[eventName]
          ?.indexOf(observe);

        if (typeof indexOfObserver === "number" && indexOfObserver > -1) {
          tableData.eventObservers[eventName]?.splice(indexOfObserver, 1);
        }
      },
    },
    get: { latestOperation: () => tableData.latestOperation },
  };
};
