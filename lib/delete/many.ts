import { databaseEventEmitter } from "../events/events.ts";
import { selectMany } from "../select/many.ts";
import type { DatabaseRecord, Nullable, TableData } from "../types/database.ts";
import type { DeleteMany } from "../types/delete.ts";
import { deleteOne } from "./one.ts";

export const deleteMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>,
): DeleteMany<Rec> => {
  const remove = deleteOne(tableData);
  const select = selectMany(tableData);
  const notifyObservers = databaseEventEmitter.notifyObservers(tableData);
  const observers = tableData.eventObservers;

  const notifyEventObservers = (
    data: Array<Rec>,
    maybeError?: Nullable<Error>,
  ) => {
    notifyObservers(
      ["delete", "many"],
      {
        isFetching: false,
        isSuccess: !maybeError,
        isEmpty: tableData.records.length === 0,
      },
      null,
    );

    observers["delete-many"]?.forEach((notify) => notify(data));
    observers["delete"]?.forEach((notify) => notify(data));
  };

  return (ids, emitEvent = true) => {
    const records = select(ids, false).data ?? [];
    const results = ids.map((id) => remove(id, false));
    const maybeError = results.find(({ error }) => error)?.error;
    if (emitEvent) notifyEventObservers(records, maybeError);
    tableData.latestOperation = "delete";
    return { data: null, error: maybeError ?? null };
  };
};
