import type {
  DatabaseRecord,
  DatabaseRecordPartial,
  DatabaseResult
} from './database';

export type UpdateOne<Rec extends DatabaseRecord> = (
  record: DatabaseRecordPartial<Rec>,
  emitEvent?: boolean
) => DatabaseResult<Rec>;

export type UpdateMany<Rec extends DatabaseRecord> = (
  ...records: Array<DatabaseRecordPartial<Rec>>
) => DatabaseResult<Array<Rec>>;

export type UpdateCallback<Rec extends DatabaseRecord> = (record: Rec) => Rec;

export type UpdateAll<Rec extends DatabaseRecord> = (
  update: UpdateCallback<Rec>
) => DatabaseResult<Array<Rec>>;

export type Update<Rec extends DatabaseRecord> = {
  one: UpdateOne<Rec>;
  many: UpdateMany<Rec>;
  all: UpdateAll<Rec>;
};
