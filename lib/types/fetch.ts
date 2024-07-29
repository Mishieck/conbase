import type { OperationCountRecord } from './operations';

export type Fetch = (emitEvent?: boolean) => void;
export type Fetcher = OperationCountRecord<Fetch>;
