import { describe, it, expect } from 'bun:test';
import type { Collection, Index } from '../types/database';
import { selectOne } from './one';

type User = { id: string; name: string };

const fields: Index<keyof User> = { id: 0, name: 1 };
const userRecord = { id: '1', name: 'Name' };
const createUser = (): User => ({ ...userRecord });
const userArray: Array<User[keyof User]> = [userRecord.id, userRecord.name];

const createCollection = (useProxy = true): Collection<User> => ({
  name: 'Users',
  fields,
  useProxy,
  index: null,
  records: [[...userArray]]
});

describe('selectOne', () => {
  it('should select a record using a proxy', () => {
    const expectedRecord = createUser();
    const collection = createCollection();
    const { data: record } = selectOne(collection)(userRecord.id);

    for (const key in fields) {
      expect(record?.[key as keyof User]).toBe(
        expectedRecord[key as keyof User]
      );
    }
  });

  it('should select a record without using a proxy', () => {
    const expectedRecord = createUser();
    const collection = createCollection(false);
    const { data: record } = selectOne(collection)(userRecord.id);
    expect(record).toEqual(expectedRecord);
  });
});
