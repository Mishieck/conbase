import type { DatabaseRecord, TableData } from './database';
import type {
  Operation,
  OperationCount,
  OperationCountRecord,
  OperationName,
  OperationRecord
} from './operations';

export type OperationFlagCountRecord = OperationCountRecord<boolean>;
export type OperationFlags = OperationRecord<boolean>;
export type EventStatus = 'fetching' | 'success' | 'empty' | 'error';
export type EventStatusRecord = Record<`is${Capitalize<EventStatus>}`, boolean>;
export type DatabaseEventName = `${OperationName}${`-${OperationCount}` | ''}`;

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

export type ObserveOne<Rec extends DatabaseRecord> = (payload: Rec) => void;

export type ObserveMany<Rec extends DatabaseRecord> =
  (payload: Array<Rec>) => void;

export type ObserveAll<Rec extends DatabaseRecord> = ObserveMany<Rec>;

export type EventObserver<
  EventName extends DatabaseEventName,
  Rec extends DatabaseRecord
> = EventName extends `${OperationName}-one`
  ? ObserveOne<Rec>
  : EventName extends `${OperationName}-all`
  ? ObserveAll<Rec>
  : ObserveMany<Rec>

export type Observe<
  EventName extends DatabaseEventName,
  Rec extends DatabaseRecord
> = (event: EventName, observe: EventObserver<EventName, Rec>) => void;


export type RemoveObserver<
  EventName extends DatabaseEventName,
  Rec extends DatabaseRecord
> = Observe<EventName, Rec>;

export type ObserverRecord<Rec extends DatabaseRecord> = Partial<{
  [Key in DatabaseEventName]: Array<EventObserver<Key, Rec>>
}>;

