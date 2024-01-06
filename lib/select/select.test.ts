import { describe, it, expect } from 'bun:test';
import type { Collection, Index } from '../types/database';
import { selectOne } from './one';
import { selectMany } from './many';

type User = { id: string; name: string };

const fields: Index<keyof User> = { id: 0, name: 1 };
const userRecord = { id: '1', name: 'Name' };
const createUser = (): User => ({ ...userRecord });
const createArray = (record: User) =>
  [record.id, record.name] as Array<User[keyof User]>;
const userArray = createArray(userRecord);

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

describe('selectMany', () => {
  it('should select many records', () => {
    const records = [createUser(), { ...createUser(), id: '2' }];

    const collection = {
      ...createCollection(),
      records: records.map(createArray)
    };

    const { data } = selectMany<User>(collection)('1', '2');

    records.forEach((expected, i) => {
      const actual = data?.[i];

      for (const key in fields) {
        expect(expected[key as keyof User]).toBe(
          actual?.[key as keyof User] ?? ''
        );
      }
    });
  });
});
