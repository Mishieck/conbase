import type { DatabaseRecord } from "./database.ts";
import type { Delete } from "./delete.ts";
import type { AddObserver, DatabaseEventName, Observe } from "./events.ts";
import type { Fetcher } from "./fetch.ts";
import type { Insert } from "./insert.ts";
import type { OperationName } from "./operations.ts";
import type { Select } from "./select.ts";
import type { Update } from "./update.ts";

type TableObserve<Rec extends DatabaseRecord> = <
  EventName extends DatabaseEventName,
>(
  ...params: Parameters<Observe<EventName, Rec>>
) => ReturnType<Observe<EventName, Rec>>;

export type Table<Rec extends DatabaseRecord> = {
  insert: Insert<Rec>;
  select: Select<Rec>;
  update: Update<Rec>;
  delete: Delete<Rec>;
  fetch: Fetcher;
  add: {
    observer: AddObserver<Rec>;
  };
  remove: {
    observer: TableObserve<Rec>;
  };
  observe: TableObserve<Rec>;
  get: {
    latestOperation: () => OperationName | undefined;
  };
};
