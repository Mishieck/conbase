import { DatabaseError } from '../error/error';
import type { Collection, DatabaseRecord, DeleteOne } from '../types/database';

export const deleteOne = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): DeleteOne<Rec> => {
  return id => {
    const idIndex = collection.fields.id;

    const indexOfRecord = collection.records.findIndex(
      rec => rec[idIndex] === id
    );

    if (indexOfRecord < 0)
      return {
        data: null,
        error: new DatabaseError('NOT-EXISTS', `Couldn't find record ${id}`)
      };

    collection.records.splice(indexOfRecord, 1);
    return { data: null, error: null };
  };
};
