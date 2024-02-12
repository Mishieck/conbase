import type { Collection, DatabaseRecord, Delete } from '../types/database';
import { deleteAll } from './all';
import { deleteMany } from './many';
import { deleteOne } from './one';

export const Remover = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): Delete<Rec> => ({
  one: deleteOne(collection),
  many: deleteMany(collection),
  all: deleteAll(collection)
});
