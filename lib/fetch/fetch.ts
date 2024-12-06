import { databaseEventEmitter, operationCounts } from "../events/events.ts";
import type { DatabaseRecord, TableData } from "../types/database.ts";
import type { Fetch, Fetcher as FetcherType } from "../types/fetch.ts";
import type { OperationCount } from "../types/operations.ts";

const fetch =
  <Rec extends DatabaseRecord>(tableData: TableData<Rec>) =>
  (count: OperationCount): Fetch => {
    const notifyObservers = () => {
      databaseEventEmitter.notifyObservers<Rec>(tableData)(
        ["fetch", count],
        {
          isEmpty: !tableData.records.length,
          isFetching: true,
          isSuccess: true,
        },
        null,
      );

      tableData.eventObservers["fetch"]?.forEach((notify) => notify);
    };

    return (emitEvent = true) => {
      tableData.latestOperation = "fetch";
      if (emitEvent) notifyObservers();
    };
  };

export const Fetcher = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>,
): FetcherType =>
  operationCounts.reduce(
    (fetcher, count) => ({ ...fetcher, [count]: fetch(tableData)(count) }),
    {} as FetcherType,
  );
