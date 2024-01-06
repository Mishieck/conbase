import {
  convertArrayToRecord,
  convertArrayToRecordProxy
} from '../record-converter/record-converter';
import type { Collection, DatabaseRecord, SelectAll } from '../types/database';

export const selectAll = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): SelectAll<Rec> => {
  const convert = (
    collection.useProxy ? convertArrayToRecordProxy : convertArrayToRecord
  )<Rec>(collection.fields);

  return () => {
    return { data: collection.records.map(convert), error: null };
  };
};
