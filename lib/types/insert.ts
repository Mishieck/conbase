import type { DatabaseRecord, DatabaseResult } from './database';

export type InsertOne<Rec extends DatabaseRecord> = (
  record: Rec,
  emitEvent?: boolean
) => DatabaseResult;

export type InsertMany<Rec extends DatabaseRecord> = (
  records: Array<Rec>
) => DatabaseResult;

export type InsertAll<Rec extends DatabaseRecord> = (
  records: Array<Rec>
) => DatabaseResult<Array<Rec>>;

export type Insert<Rec extends DatabaseRecord> = {
  one: InsertOne<Rec>;
  many: InsertMany<Rec>;
  all: InsertAll<Rec>;
};
