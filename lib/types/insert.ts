import type { DatabaseRecord, DatabaseResult } from "./database.ts";

export type InsertOne<Rec extends DatabaseRecord> = (
  record: Rec,
  emitEvent?: boolean,
) => DatabaseResult;

export type InsertMany<Rec extends DatabaseRecord> = (
  records: Array<Rec>,
  emitEvent?: boolean,
) => DatabaseResult;

export type InsertAll<Rec extends DatabaseRecord> = (
  records: Array<Rec>,
  emitEvent?: boolean,
) => DatabaseResult<Array<Rec>>;

export type Insert<Rec extends DatabaseRecord> = {
  one: InsertOne<Rec>;
  many: InsertMany<Rec>;
  all: InsertAll<Rec>;
};
