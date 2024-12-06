import { databaseEventEmitter } from "../events/events.ts";
import { convertArrayToRecord } from "../record-converter/record-converter.ts";
import type { DatabaseRecord, TableData } from "../types/database.ts";
import type { SelectAll } from "../types/select.ts";

export const selectAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>,
): SelectAll<Rec> => {
  const convert = convertArrayToRecord<Rec>(tableData.fields);
  const notifyObservers = databaseEventEmitter.notifyObservers<Rec>(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers = (records: Array<Rec>) => {
    notifyObservers(
      ["select", "all"],
      {
        isFetching: false,
        isSuccess: true,
        isEmpty: tableData.records.length === 0,
      },
      records,
    );

    observers["select-all"]?.forEach((notify) => notify(records));
    observers["select"]?.forEach((notify) => notify(records));
  };

  return (emitEvent = true) => {
    const data = tableData.records.map(convert);
    if (emitEvent) notifyEventObservers(data);
    return { data, error: null };
  };
};
