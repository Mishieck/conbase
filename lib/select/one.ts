import { DatabaseError } from '../error/error';
import {
  convertArrayToRecord,
  convertArrayToRecordProxy
} from '../record-converter/record-converter';
import type { Collection, DatabaseRecord, SelectOne } from '../types/database';

export const selectOne = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): SelectOne<Rec> => {
  const convertArray = collection.useProxy
    ? convertArrayToRecordProxy
    : convertArrayToRecord;

  const convert = convertArray<Rec>(collection.fields);

  return id => {
    let record = collection.index
      ? collection.records[collection.index[id]]
      : collection.records.find(record => record[0] === id);

    return {
      data: record ? convert(record) : null,
      error: record
        ? null
        : new DatabaseError(
            'NOT-EXISTS',
            `Record "${id}" not found in "${collection.name}".`
          )
    };
  };
};