export type OperationName = "insert" | "select" | "update" | "delete" | "fetch";
export type OperationCount = "one" | "many" | "all";
export type Operation = [OperationName, OperationCount];
export type OperationCountRecord<Value> = Record<OperationCount, Value>;

export type OperationRecord<Value> = Record<
  OperationName,
  OperationCountRecord<Value>
>;

export type IsOperation = Record<
  `is${Capitalize<OperationName>}`,
  () => boolean
>;
