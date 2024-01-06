import { DatabaseError } from '../error/error';
import { convertRecordToArray } from '../record-to-array/record-to-array';
import type { Collection, DatabaseRecord, InsertOne } from '../types/database';

export const insertOne =
  <Rec extends DatabaseRecord>(collection: Collection<Rec>): InsertOne<Rec> =>
  record => {
    let exists: boolean;
    if (collection.index) exists = record.id in collection.index;
    else exists = !!collection.records.find(([id]) => id === record.id);

    if (exists) {
      const message = `Record '${record.id}' already exists in '${collection.name}'.`;

      return {
        data: null,
        error: new DatabaseError('EXISTS', message)
      };
    }

    collection.records.push(convertRecordToArray(collection.fields)(record));

    if (collection.index)
      collection.index[record.id] = collection.records.length - 1;

    return { data: null, error: null };
  };
