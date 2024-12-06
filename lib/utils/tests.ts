import { defaultOperationFlags } from "../events/events.ts";
import type { Index, TableData } from "../types/database.ts";
import type {
  DatabaseEvent,
  EventStatusRecord,
  OperationFlags,
} from "../types/events.ts";
import type { OperationCount, OperationName } from "../types/operations.ts";

export type User = { id: string; name: string };
export type UserArray = [User["id"], User["name"]];

export type UserEvent = Pick<DatabaseEvent<User>, "status"> & {
  is: OperationFlags;
};

export const createUserTableData = (
  index: Index<User> | null = null,
): TableData<User> => ({
  name: "Users",
  fields: { id: 0, name: 1 },
  records: [],
  index,
  observers: [],
  eventObservers: {},
});

export const createUserRecord = (id: number, name?: string): User => ({
  id: String(id),
  name: name ?? "Remover",
});

export const createUserArray = (id: number, name?: string): UserArray => [
  String(id),
  name ?? "Remover",
];

export const addUserRecord =
  (tableData: TableData<User>) => (...inputs: [number] | [number, string]) =>
    tableData.records.push(createUserArray(inputs[0], inputs[1]));

export const clearUserRecords =
  (tableData: TableData<User>) => () => (tableData.records = []);

export const clearUserObservers =
  (tableData: TableData<User>) => () => (tableData.observers = []);

export const observeEvents =
  (tableData: TableData<User>) => (operation: CallableFunction) =>
    new Promise<DatabaseEvent<User>>((resolve) => {
      tableData.observers.push(resolve);
      operation();
    });

export const createUserEvent = <
  Op extends OperationName,
  Count extends OperationCount,
>(
  [op, count]: [Op, Count],
  status: Omit<EventStatusRecord, "isError">,
): UserEvent => ({
  is: {
    ...defaultOperationFlags,
    [op]: {
      ...defaultOperationFlags[op],
      [count]: true,
    },
  },
  status: {
    ...status,
    isError: !status.isSuccess,
  },
});
