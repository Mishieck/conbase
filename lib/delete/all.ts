import type { Collection, DatabaseRecord, DeleteAll } from '../types/database';

export const deleteAll = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): DeleteAll => {
  return () => {
    collection.records = [];
    return { data: null, error: null };
  };
};
