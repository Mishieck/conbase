import { convertArrayToRecord } from '../record-converter/record-converter';
import type { Collection, DatabaseRecord, SelectAll } from '../types/database';

export const selectAll = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): SelectAll<Rec> => {
  const convert = convertArrayToRecord<Rec>(collection.fields);

  return () => {
    return { data: collection.records.map(convert), error: null };
  };
};
