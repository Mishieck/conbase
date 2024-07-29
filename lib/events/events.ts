import type { DatabaseRecord } from '../types/database';
import type {
  DatabaseEventEmitter,
  DatabaseEvent as Event,
  EventStatusRecord,
  OperationFlagCountRecord,
  OperationFlags
} from '../types/events';
import type {
  IsOperation as IsOperationType,
  Operation,
  OperationCount,
  OperationName
} from '../types/operations';

export const operationNames: Array<OperationName> = [
  'delete',
  'insert',
  'select',
  'update',
  'fetch'
];

export const operationCounts: Array<OperationCount> = ['all', 'many', 'one'];

const operationCountRecord = operationCounts.reduce(
  (flags, count) => ({ ...flags, [count]: false }),
  {} as OperationFlagCountRecord
);

export const defaultOperationFlags = operationNames.reduce(
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
  const counts = { ...operationFlags[name] };
  counts[count] = true;
  operationFlags[name] = counts;

  return {
    is: operationFlags,
    status: { ...status, isError: !status.isSuccess },
    data
  };
};

export const databaseEventEmitter: DatabaseEventEmitter = {
  addObserver: tableData => observe => {
    tableData.observers.push(observe);
  },
  notifyObservers: tableData => (operation, status, data) => {
    const event = DatabaseEvent(operation, status, data);
    for (const observe of tableData.observers) observe(event);
  }
};

export const IsOperation = (operationFlags: OperationFlags): IsOperationType =>
  operationNames.reduce(
    (isOperation, name) => ({
      ...isOperation,
      [`is${name[0].toUpperCase()}${name.substring(
        1
      )}` as `is${OperationName}`]: () =>
          Object.values(operationFlags[name]).some(value => value)
    }),
    {} as IsOperationType
  );

