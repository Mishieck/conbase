import type { DatabaseRecord, TableData } from './database';
import type {
  Operation,
  OperationCountRecord,
  OperationRecord
} from './operations';

export type OperationFlagCountRecord = OperationCountRecord<boolean>;
export type OperationFlags = OperationRecord<boolean>;
export type EventStatus = 'fetching' | 'success' | 'empty' | 'error';
export type EventStatusRecord = Record<`is${Capitalize<EventStatus>}`, boolean>;

export type DatabaseEvent<Rec extends DatabaseRecord> = {
  is: OperationFlags;
  status: EventStatusRecord;
  data: Array<Rec> | null;
};

export type DatabaseEventObserver<Rec extends DatabaseRecord> = (
  event: DatabaseEvent<Rec>
) => void;

export type AddObserver<Rec extends DatabaseRecord> = (
  observe: DatabaseEventObserver<Rec>
) => void;

export type NotifyObservers<Rec extends DatabaseRecord> = (
  operation: Operation,
  status: Omit<EventStatusRecord, 'isError'>,
  data: Array<Rec> | null
) => void;

export type DatabaseEventEmitter = {
  addObserver: <Rec extends DatabaseRecord>(
    tableData: TableData<Rec>
  ) => AddObserver<Rec>;
  notifyObservers: <Rec extends DatabaseRecord>(
    tableData: TableData<Rec>
  ) => NotifyObservers<Rec>;
};