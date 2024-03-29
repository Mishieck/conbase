import type { DatabaseError } from '../error/error';
import type { DatabaseEventObserver } from './events';
import type { OperationName } from './operations';

export type Nullable<Value> = Value | null;
export type DatabaseRecord = { id: string };

export type DatabaseResult<Data = null> = {
  data: Nullable<Data>;
  error: Nullable<DatabaseError>;
};

export type TableDataUtil<
  Rec extends DatabaseRecord,
  Util extends CallableFunction
> = (tableData: TableData<Rec>) => Util;

export type DatabaseRecordPartial<Rec extends DatabaseRecord> = Partial<Rec> &
  Pick<Rec, 'id'>;

export type Fields<Rec extends DatabaseRecord> = Record<keyof Rec, number>;

export type Index<Rec extends DatabaseRecord> = Record<Rec['id'], number>;

export type TableData<Rec extends DatabaseRecord> = {
  name: string;
  fields: Fields<Rec>;
  records: Array<Array<unknown>>;
  index: Index<Rec> | null;
  observers: Array<DatabaseEventObserver<Rec>>;
  latestOperation?: OperationName;
};
