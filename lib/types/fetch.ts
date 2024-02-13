import type { OperationCountRecord } from './operations';

export type Fetch = () => void;
export type Fetcher = OperationCountRecord<Fetch>;
