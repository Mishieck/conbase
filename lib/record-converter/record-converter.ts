import type { DatabaseRecord, Fields } from "../types/database.ts";

export const convertRecordToArray =
  <Rec extends DatabaseRecord>(fields: Fields<Rec>) =>
  (record: Rec): Array<unknown> =>
    Object.entries(fields).map(([key]) => record[key as keyof Rec] ?? null);

export const convertArrayToRecord =
  <Rec extends DatabaseRecord>(fields: Fields<Rec>) =>
  (array: Array<unknown>): Rec =>
    Object.entries(fields).reduce(
      (record, [key, value]) => ({ ...record, [key]: array[value] }),
      {} as Rec,
    );
