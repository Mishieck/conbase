import type { DatabaseRecord, Index } from '../types/database';

export const convertRecordToArray =
  <Rec extends DatabaseRecord>(fields: Index<string>) =>
  (record: Rec) =>
    Object.entries(fields).map(([key]) => record[key as keyof Rec] ?? null);
