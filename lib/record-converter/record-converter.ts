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

export const convertArrayToRecordProxy =
  <Rec extends DatabaseRecord>(fields: Index<string>) =>
  (array: Array<unknown>): Rec => {
    return new Proxy({} as unknown as Rec, {
      get: (_target, key) => array[fields[key as string]],
      has: (_target, key) => key in fields
    });
  };
