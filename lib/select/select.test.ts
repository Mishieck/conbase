import { describe, it, expect } from 'bun:test';
import type { TableData, Fields } from '../types/database';
import { selectOne } from './one';
import { selectMany } from './many';
import { selectAll } from './all';
import { Selector } from './select';

type User = { id: string; name: string };

const fields: Fields<User> = { id: 0, name: 1 };
const userRecord = { id: '1', name: 'Name' };
const createUser = (): User => ({ ...userRecord });
const createArray = (record: User) =>
  [record.id, record.name] as Array<User[keyof User]>;
const userArray = createArray(userRecord);

const createTableData = (): TableData<User> => ({
  name: 'Users',
  fields,
  index: null,
  records: [[...userArray]],
  observers: []
});

describe('selectOne', () => {
  it('should select a record', () => {
    const expectedRecord = createUser();
    const tableData = createTableData();
    const { data: record } = selectOne(tableData)(userRecord.id);
    expect(record).toEqual(expectedRecord);
  });
});

describe('selectMany', () => {
  it('should select many records', () => {
    const records = [createUser(), { ...createUser(), id: '2' }];

    const tableData = {
      ...createTableData(),
      records: records.map(createArray)
    };

    const { data } = selectMany<User>(tableData)('1', '2');

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

    const tableData = {
      ...createTableData(),
      records: records.map(createArray)
    };

    const { data } = selectAll<User>(tableData)();

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

describe('Selector', () => {
  it('should select records using various methods', () => {
    const records = [createUser(), { ...createUser(), id: '2' }];

    const tableData = {
      ...createTableData(),
      records: records.map(createArray)
    };

    const select = Selector(tableData);
    expect(select.one('1').data).toMatchObject({ id: '1' });
    expect(select.many('1', '2').data).toHaveLength(2);
    expect(select.all().data).toHaveLength(2);
  });
});
