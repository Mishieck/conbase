import type { Collection, DatabaseRecord, DeleteMany } from '../types/database';
import { deleteOne } from './one';

export const deleteMany = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): DeleteMany<Rec> => {
  const remove = deleteOne(collection);

  return (...ids) => {
    const results = ids.map(remove);
    const maybeError = results.find(({ error }) => error)?.error;
    return { data: null, error: maybeError ?? null };
  };
};
