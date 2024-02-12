import { Remover } from '../delete/delete';
import { Inserter } from '../insert/insert';
import { Selector } from '../select/select';
import type {
  Collection,
  CollectionHandler as CollectionHandlerType,
  DatabaseRecord,
  Fields,
  Index
} from '../types/database';
import { Updater } from '../update/update';

export const createFields = <Rec extends DatabaseRecord>(
  ...fieldNames: Array<keyof Rec>
): Fields<Rec> =>
  fieldNames.reduce(
    (fields, key, i) => ({ ...fields, [key]: i }),
    {} as Fields<Rec>
  );

export const createCollection = <Rec extends DatabaseRecord>(
  name: string,
  fields: Array<keyof Rec>,
  useIndex: boolean
): Collection<Rec> => {
  return {
    name,
    fields: createFields(...fields),
    index: useIndex ? ({} as Index<Rec>) : null,
    records: []
  };
};

export const CollectionHandler = <Rec extends DatabaseRecord>(
  name: string,
  fields: Array<keyof Rec>,
  useIndex: boolean = false
): CollectionHandlerType<Rec> => {
  const collection = createCollection(name, fields, useIndex);

  return {
    insert: Inserter(collection),
    select: Selector(collection),
    update: Updater(collection),
    delete: Remover(collection)
  };
};
