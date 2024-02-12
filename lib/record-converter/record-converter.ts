import type { DatabaseRecord, Index } from '../types/database';

export const convertRecordToArray =
  <Rec extends DatabaseRecord>(fields: Index<string>) =>
  (record: Rec) =>
    Object.entries(fields).map(([key]) => record[key as keyof Rec] ?? null);

export const convertArrayToRecord =
  <Rec extends DatabaseRecord>(fields: Index<string>) =>
  (array: Array<unknown>): Rec =>
    Object.entries(fields).reduce(
      (record, [key, value]) => ({ ...record, [key]: array[value] }),
      {} as Rec
    );
