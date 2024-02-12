import { describe, it, expect } from 'bun:test';
import type { Collection, Index } from '../types/database';
import { selectOne } from './one';
import { selectMany } from './many';
import { selectAll } from './all';

type User = { id: string; name: string };

const fields: Index<keyof User> = { id: 0, name: 1 };
const userRecord = { id: '1', name: 'Name' };
const createUser = (): User => ({ ...userRecord });
const createArray = (record: User) =>
  [record.id, record.name] as Array<User[keyof User]>;
const userArray = createArray(userRecord);

const createCollection = (): Collection<User> => ({
  name: 'Users',
  fields,
  index: null,
  records: [[...userArray]]
});

describe('selectOne', () => {
  it('should select a record', () => {
    const expectedRecord = createUser();
    const collection = createCollection();
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

describe('selectAll', () => {
  it('should select all records', () => {
    const records = [createUser(), { ...createUser(), id: '2' }];

    const collection = {
      ...createCollection(),
      records: records.map(createArray)
    };

    const { data } = selectAll<User>(collection)();

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
