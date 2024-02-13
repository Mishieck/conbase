import type { DatabaseRecord } from './database';
import type { Delete } from './delete';
import type { AddObserver } from './events';
import type { Fetcher } from './fetch';
import type { Insert } from './insert';
import type { Select } from './select';
import type { Update } from './update';

export type Table<Rec extends DatabaseRecord> = {
  insert: Insert<Rec>;
  select: Select<Rec>;
  update: Update<Rec>;
  delete: Delete<Rec>;
  fetch: Fetcher;
  add: {
    observer: AddObserver<Rec>;
  };
};
