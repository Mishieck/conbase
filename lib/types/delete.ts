import type { DatabaseRecord, DatabaseResult } from './database';

export type DeleteOne<Rec extends DatabaseRecord> = (
  id: Rec['id']
) => DatabaseResult;

export type DeleteMany<Rec extends DatabaseRecord> = (
  ...ids: Array<Rec['id']>
) => DatabaseResult;

export type DeleteAll = () => DatabaseResult;

export type Delete<Rec extends DatabaseRecord> = {
  one: DeleteOne<Rec>;
  many: DeleteMany<Rec>;
  all: DeleteAll;
};
