import type { DatabaseRecord } from './database';
import type { Delete } from './delete';
import type { AddObserver, DatabaseEventName, Observe } from './events';
import type { Fetcher } from './fetch';
import type { Insert } from './insert';
import type { OperationName } from './operations';
import type { Select } from './select';
import type { Update } from './update';

type TableObserve<Rec extends DatabaseRecord> = <
  EventName extends DatabaseEventName,
>(...params: Parameters<Observe<EventName, Rec>>) =>
  ReturnType<Observe<EventName, Rec>>;

export type Table<Rec extends DatabaseRecord> = {
  insert: Insert<Rec>,
  select: Select<Rec>,
  update: Update<Rec>,
  delete: Delete<Rec>,
  fetch: Fetcher,
  add: {
    observer: AddObserver<Rec>
  };
  remove: {
    observer: TableObserve<Rec>,
  };
  observe: TableObserve<Rec>,
  get: {
    latestOperation: () => OperationName | undefined
  }
};
