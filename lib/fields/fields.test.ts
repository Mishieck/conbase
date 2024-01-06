import { describe, it, expect } from 'bun:test';
import type { Index } from '../types/database';
import { createFields } from './fields';

describe('createFields', () => {
  const record = {
    id: '1',
    firstName: 'First',
    lastName: 'Last',
    age: 23
  };

  const expectedFields: Index<keyof typeof record> = {
    id: 0,
    firstName: 1,
    lastName: 2,
    age: 3
  };

  it('should create fields for a record', () => {
    expect(createFields(record)).toMatchObject(expectedFields);
  });
});
