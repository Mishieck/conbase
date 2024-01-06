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

export type UpdateRecord<Rec extends DatabaseRecord> = Partial<Rec> &
  Pick<Rec, 'id'>;

export type InsertOne<Rec extends DatabaseRecord> = (
  record: Rec
) => DatabaseResult;

export type InsertMany<Rec extends DatabaseRecord> = (
  ...records: Array<Rec>
) => DatabaseResult;

export type SelectOne<Rec extends DatabaseRecord> = (id: Rec['id']) => Rec;

export type SelectMany<Rec extends DatabaseRecord> = (
  ...ids: Array<Rec['id']>
) => Array<Rec>;

export type SelectAll<Rec extends DatabaseRecord> = () => Array<Rec>;

export type UpdateOne<Rec extends DatabaseRecord> = (
  record: UpdateRecord<Rec>
) => void;

export type UpdateMany<Rec extends DatabaseRecord> = (
  ...records: Array<UpdateRecord<Rec>>
) => void;

export type DeleteOne<Rec extends DatabaseRecord> = (id: Rec['id']) => void;

export type DeleteMany<Rec extends DatabaseRecord> = (
  ...ids: Array<Rec['id']>
) => void;

export type DeleteAll = () => void;

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

export type RecordProxy<Rec extends DatabaseRecord> = {
  fields: Index;
  record: Array<unknown>;
};
