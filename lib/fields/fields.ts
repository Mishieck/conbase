import type { Index } from '../types/database';

export const createFields = (record: Record<string, unknown>): Index<string> =>
  Object.entries(record).reduce(
    (fields, [key], i) => ({ ...fields, [key]: i }),
    {}
  );
