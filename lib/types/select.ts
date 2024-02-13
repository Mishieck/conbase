import type { DatabaseRecord, DatabaseResult } from './database';

export type SelectOne<Rec extends DatabaseRecord> = (
  id: Rec['id'],
  emitEvent?: boolean
) => DatabaseResult<Rec>;

export type SelectMany<Rec extends DatabaseRecord> = (
  ...ids: Array<Rec['id']>
) => DatabaseResult<Array<Rec>>;

export type SelectAll<Rec extends DatabaseRecord> = () => DatabaseResult<
  Array<Rec>
>;

export type Select<Rec extends DatabaseRecord> = {
  one: SelectOne<Rec>;
  many: SelectMany<Rec>;
  all: SelectAll<Rec>;
};
