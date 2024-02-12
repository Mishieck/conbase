import type { DatabaseError } from '../error/error';

export type Nullable<Value> = Value | null;
export type DatabaseRecord = { id: string };

export type DatabaseResult<Data = null> = {
  data: Nullable<Data>;
  error: Nullable<DatabaseError>;
};

export type CollectionUtil<
  Rec extends DatabaseRecord,
  Util extends CallableFunction
> = (collection: Collection<Rec>) => Util;

export type DatabaseRecordPartial<Rec extends DatabaseRecord> = Partial<Rec> &
  Pick<Rec, 'id'>;

export type InsertOne<Rec extends DatabaseRecord> = (
  record: Rec
) => DatabaseResult;

export type InsertMany<Rec extends DatabaseRecord> = (
  ...records: Array<Rec>
) => DatabaseResult;

export type SelectOne<Rec extends DatabaseRecord> = (
  id: Rec['id']
) => DatabaseResult<Rec>;

export type SelectMany<Rec extends DatabaseRecord> = (
  ...ids: Array<Rec['id']>
) => DatabaseResult<Array<Rec>>;

export type SelectAll<Rec extends DatabaseRecord> = () => DatabaseResult<
  Array<Rec>
>;

export type UpdateOne<Rec extends DatabaseRecord> = (
  record: DatabaseRecordPartial<Rec>
) => DatabaseResult<Rec>;

export type UpdateMany<Rec extends DatabaseRecord> = (
  ...records: Array<DatabaseRecordPartial<Rec>>
) => DatabaseResult<Array<Rec>>;

export type DeleteOne<Rec extends DatabaseRecord> = (
  id: Rec['id']
) => DatabaseResult;

export type DeleteMany<Rec extends DatabaseRecord> = (
  ...ids: Array<Rec['id']>
) => DatabaseResult;

export type DeleteAll = () => DatabaseResult;

export type Insert<Rec extends DatabaseRecord> = {
  one: InsertOne<Rec>;
  many: InsertMany<Rec>;
};

export type Select<Rec extends DatabaseRecord> = {
  one: SelectOne<Rec>;
  many: SelectMany<Rec>;
  all: SelectAll<Rec>;
};

export type Update<Rec extends DatabaseRecord> = {
  one: UpdateOne<Rec>;
  many: UpdateMany<Rec>;
};

export type Delete<Rec extends DatabaseRecord> = {
  one: DeleteOne<Rec>;
  many: DeleteMany<Rec>;
  all: DeleteAll;
};

export type Index<Key extends string = string> = Record<Key, number>;

export type Collection<Rec extends DatabaseRecord> = {
  name: string;
  fields: Index;
  records: Array<Array<unknown>>;
  index: Nullable<Index>;
};

export type CollectionHandler<Rec extends DatabaseRecord> = {
  insert: Insert<Rec>;
  select: Select<Rec>;
  update: Update<Rec>;
  delete: Delete<Rec>;
};
