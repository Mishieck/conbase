import type { DatabaseRecord } from './database';
import type { OperationCountRecord, OperationRecord } from './operations';

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
