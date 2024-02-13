import type { Index, TableData } from '../types/database';
import type { DatabaseEvent, EventStatusRecord } from '../types/events';
import type { OperationCount, OperationName } from '../types/operations';

export type User = { id: string; name: string };
export type UserArray = [User['id'], User['name']];

export type UserEvent<
  Op extends OperationName,
  Count extends OperationCount
> = Pick<DatabaseEvent<User>, 'status'> & {
  is: { [key in Op]: { [key in Count]: boolean } };
};

export const createUserTableData = (
  index: Index<User> | null = null
): TableData<User> => ({
  name: 'Users',
  fields: { id: 0, name: 1 },
  records: [],
  index,
  observers: []
});

export const createUserRecord = (id: number, name?: string): User => ({
  id: String(id),
  name: name ?? 'Remover'
});

export const createUserArray = (id: number, name?: string): UserArray => [
  String(id),
  name ?? 'Remover'
];

export const addUserRecord =
  (tableData: TableData<User>) =>
  (...inputs: [number] | [number, string]) =>
    tableData.records.push(createUserArray(inputs[0], inputs[1]));

export const clearUserRecords = (tableData: TableData<User>) => () =>
  (tableData.records = []);

export const clearUserObservers = (tableData: TableData<User>) => () =>
  (tableData.observers = []);

export const observeEvents =
  (tableData: TableData<User>) => (operation: CallableFunction) =>
    new Promise<DatabaseEvent<User>>(resolve => {
      tableData.observers.push(resolve);
      operation();
    });

export const createUserEvent = <
  Op extends OperationName,
  Count extends OperationCount
>(
  [op, count]: [Op, Count],
  status: Omit<EventStatusRecord, 'isError'>
): UserEvent<Op, Count> => ({
  //@ts-ignore: That's how the type is
  is: { [op]: { [count]: true } },
  status: {
    ...status,
    isError: !status.isSuccess
  }
});
