import type { DatabaseRecord } from '../types/database';
import type {
  DatabaseEvent as Event,
  EventStatusRecord,
  OperationFlagCountRecord,
  OperationFlags
} from '../types/events';
import type {
  Operation,
  OperationCount,
  OperationName
} from '../types/operations';

const operationNames: Array<OperationName> = [
  'delete',
  'insert',
  'select',
  'update'
];

const operationCounts: Array<OperationCount> = ['all', 'many', 'one'];

const operationCountRecord = operationCounts.reduce(
  (flags, count) => ({ ...flags, [count]: false }),
  {} as OperationFlagCountRecord
);

const defaultOperationFlags = operationNames.reduce(
  (flags, name) => ({ ...flags, [name]: operationCountRecord }),
  {} as OperationFlags
);

export const DatabaseEvent = <Rec extends DatabaseRecord>(
  operation: Operation,
  status: Omit<EventStatusRecord, 'isError'>,
  data: Event<Rec>['data']
): Event<Rec> => {
  const operationFlags: OperationFlags = { ...defaultOperationFlags };
  const [name, count] = operation;
  operationFlags[name][count] = true;

  return {
    is: operationFlags,
    status: { ...status, isError: !status.isSuccess },
    data
  };
};
