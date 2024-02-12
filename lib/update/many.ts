import type { Collection, DatabaseRecord, UpdateMany } from '../types/database';
import { updateOne } from './one';

export const updateMany = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): UpdateMany<Rec> => {
  const update = updateOne(collection);

  return (...updates) => {
    const results = updates.map(update);
    const maybeError = results.find(({ error }) => !!error);

    return {
      data: maybeError
        ? null
        : results.filter(({ error }) => !error).map(({ data }) => data as Rec),
      error: maybeError
        ? results.find(({ error }) => error)?.error ?? null
        : null
    };
  };
};
