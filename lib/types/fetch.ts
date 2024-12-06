import type { OperationCountRecord } from "./operations.ts";

export type Fetch = (emitEvent?: boolean) => void;
export type Fetcher = OperationCountRecord<Fetch>;
