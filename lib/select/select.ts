import type { Collection, DatabaseRecord, Select } from '../types/database';
import { selectAll } from './all';
import { selectMany } from './many';
import { selectOne } from './one';

export const Selector = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): Select<Rec> => ({
  one: selectOne(collection),
  many: selectMany(collection),
  all: selectAll(collection)
});
