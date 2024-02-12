import type { Collection, DatabaseRecord, Insert } from '../types/database';
import { insertMany } from './many';
import { insertOne } from './one';

export const Inserter = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): Insert<Rec> => ({
  one: insertOne(collection),
  many: insertMany(collection)
});
