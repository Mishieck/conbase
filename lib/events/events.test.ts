import { describe, it, expect } from 'bun:test';
import { createUserEvent } from '../utils/tests';
import type { Operation, OperationName } from '../types/operations';
import { IsOperation, operationCounts, operationNames } from './events';

describe('Events', () => {
  const getFlags = (operation: Operation) =>
    createUserEvent(operation, {
      isEmpty: true,
      isFetching: true,
      isSuccess: true
    }).is;

  for (const name of operationNames) {
    it(`should indicate ${name} operations`, async () => {
      for (const count of operationCounts) {
        const flags = getFlags([name, count]);
        const operation = IsOperation(flags);

        const capitalizedName = `${name[0].toUpperCase()}${name.substring(
          1
        )}` as Capitalize<OperationName>;

        expect(operation[`is${capitalizedName}`]()).toEqual(true);
      }
    });
  }
});
