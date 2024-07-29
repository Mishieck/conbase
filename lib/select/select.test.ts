import { describe, it, expect } from 'bun:test';
import type { TableData, Fields } from '../types/database';
import { selectOne } from './one';
import { selectMany } from './many';
import { selectAll } from './all';
import { Selector } from './select';
import {
  clearUserObservers,
  clearUserRecords,
  createUserArray,
  createUserEvent,
  createUserRecord,
  createUserTableData,
  observeEvents
} from '../utils/tests';
import { Table } from '../table/table';

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
  observers: [],
  eventObservers: {}
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

    const { data } = selectMany<User>(tableData)(['1', '2']);

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
    expect(select.many(['1', '2']).data).toHaveLength(2);
    expect(select.all().data).toHaveLength(2);
  });
});

describe('Selector Events', () => {
  const tableData = createUserTableData();
  const observe = observeEvents(tableData);
  const clearRecords = clearUserRecords(tableData);
  const clearObservers = clearUserObservers(tableData);
  const table = Table<User>('Users', ['id', 'name']);
  const user = createUserRecord(1);

  it('should handle events for selectOne', async () => {
    clearRecords();
    clearObservers();
    tableData.records.push(createUserArray(1));
    const event = await observe(() => selectOne(tableData)('1'));
    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['select', 'one'], {
        isFetching: false,
        isSuccess: true,
        isEmpty: false
      })
    );

    expect(event.data).toHaveLength(1);
    expect(event.data?.[0]).toMatchObject(createUserRecord(1));

    table.delete.all();
    table.insert.one({ ...user });
    let data, dataWithoutCount;
    table.observe('select-one', d => data = d);
    table.observe('select', d => dataWithoutCount = d);
    table.select.one(user.id);
    expect(data).toMatchObject(user);
    expect(dataWithoutCount).toBeArray();
    expect(dataWithoutCount?.[0]).toMatchObject(user);
  });

  it('should handle events for selectMany', async () => {
    clearRecords();
    clearObservers();
    tableData.records.push(
      createUserArray(1),
      createUserArray(2),
      createUserArray(3)
    );

    const event = await observe(() => selectMany(tableData)(['1', '2']));

    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['select', 'many'], {
        isFetching: false,
        isSuccess: true,
        isEmpty: false
      })
    );

    expect(event.data).toHaveLength(2);
    expect(event.data?.[0]).toMatchObject(createUserRecord(1));

    table.delete.all();
    table.insert.many([{ ...user }, { ...user, id: '2' }]);
    let data, dataWithoutCount;
    table.observe('select-many', d => data = d);
    table.observe('select', d => dataWithoutCount = d);
    table.select.many([user.id, '2']);
    expect(data).toHaveLength(2);
    expect(data?.[0]).toMatchObject(user);
    expect(dataWithoutCount).toBeArray();
    expect(dataWithoutCount?.[0]).toMatchObject(user);
  });

  it('should handle events for selectAll', async () => {
    clearRecords();
    clearObservers();

    tableData.records.push(createUserArray(1), createUserArray(2));
    const event = await observe(() => selectAll(tableData)());

    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['select', 'all'], {
        isFetching: false,
        isSuccess: true,
        isEmpty: false
      })
    );

    expect(event.data).toHaveLength(2);
    expect(event.data?.[0]).toMatchObject(createUserRecord(1));

    table.delete.all();
    table.insert.many([{ ...user }, { ...user, id: '2' }]);
    let data, dataWithoutCount;
    table.observe('select-all', d => data = d);
    table.observe('select', d => dataWithoutCount = d);
    table.select.all();
    expect(data).toHaveLength(2);
    expect(data?.[0]).toMatchObject(user);
    expect(dataWithoutCount).toBeArray();
    expect(dataWithoutCount?.[0]).toMatchObject(user);
  });
});
