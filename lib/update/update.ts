import type { Collection, DatabaseRecord, Update } from '../types/database';
import { updateMany } from './many';
import { updateOne } from './one';

export const Updater = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): Update<Rec> => ({
  one: updateOne(collection),
  many: updateMany(collection)
});
