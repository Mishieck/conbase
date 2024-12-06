import type { DatabaseRecord, DatabaseResult } from "./database.ts";

export type DeleteOne<Rec extends DatabaseRecord> = (
  id: Rec["id"],
  emitEvent?: boolean,
) => DatabaseResult;

export type DeleteMany<Rec extends DatabaseRecord> = (
  ids: Array<Rec["id"]>,
  emitEvent?: boolean,
) => DatabaseResult;

export type DeleteAll = (emitEvent?: boolean) => DatabaseResult;

export type Delete<Rec extends DatabaseRecord> = {
  one: DeleteOne<Rec>;
  many: DeleteMany<Rec>;
  all: DeleteAll;
};
