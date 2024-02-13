import { describe, it, expect } from 'bun:test';
import { insertOne } from './one';
import { insertMany } from './many';
import { DatabaseError } from '../error/error';
import { Inserter } from './insert';
import { insertAll } from './all';
import {
  addUserRecord,
  clearUserObservers,
  clearUserRecords,
  createUserEvent,
  createUserRecord,
  createUserTableData,
  observeEvents,
  type User
} from '../utils/tests';

const user: User = { id: '1', name: 'Name' };

describe('insertOne', () => {
  it('should insert a record', () => {
    const tableData = createUserTableData();
    const insert = insertOne(tableData);
    insert({ ...user });
    expect(tableData.records[0]).toEqual([user.id, user.name]);
  });

  it('should update index', () => {
    const tableData = createUserTableData({});
    const insert = insertOne(tableData);

    insert({ ...user });
    insert({ ...user, id: '2' });

    expect(tableData.records).toHaveLength(2);
    expect(tableData.index).toEqual({ '1': 0, '2': 1 });
  });

  it('should not allow duplicate records', () => {
    const tableData = createUserTableData();
    const indexedTableData = createUserTableData({});
    const insert = insertOne(tableData);
    const insertIndexed = insertOne(indexedTableData);

    insert({ ...user });
    insertIndexed({ ...user });
    const { error } = insert({ ...user });
    const { error: errorIndexed } = insertIndexed({ ...user });

    expect(tableData.records).toHaveLength(1);
    expect(error).toBeInstanceOf(DatabaseError);
    expect(errorIndexed).toBeInstanceOf(DatabaseError);
    expect(error).toMatchObject({ cause: 'EXISTS' });
  });
});

describe('insertMany', () => {
  it('should insert multiple records', () => {
    const tableData = createUserTableData();
    const insert = insertMany(tableData);
    insert({ ...user }, { ...user, id: '2' });

    expect(tableData.records).toHaveLength(2);
    expect(tableData.records[0]).toEqual([user.id, user.name]);
  });
});

describe('insertAll', () => {
  it('should insert multiple records', () => {
    const tableData = createUserTableData();
    const insert = insertAll(tableData);
    insert({ ...user }, { ...user, id: '2' });

    expect(tableData.records).toHaveLength(2);
    expect(tableData.records[0]).toEqual([user.id, user.name]);
  });
});

describe('Inserter', () => {
  it('should insert records using various methods', () => {
    const tableData = createUserTableData();
    const insert = Inserter(tableData);

    insert.one({ ...user });
    expect(tableData.records).toHaveLength(1);
    expect(tableData.records[0]).toContain('1');

    insert.many({ ...user, id: '2' }, { ...user, id: '3' });
    expect(tableData.records).toHaveLength(3);
    expect(tableData.records[1]).toContain('2');
    expect(tableData.records[2]).toContain('3');
  });
});

describe('Inserter Events', () => {
  const tableData = createUserTableData();
  const addRecord = addUserRecord(tableData);
  const clearRecords = clearUserRecords(tableData);
  const clearObservers = clearUserObservers(tableData);
  const observe = observeEvents(tableData);

  it('should handle events for insertOne', async () => {
    clearRecords();
    clearObservers();

    const event = await observe(() =>
      insertOne(tableData)(createUserRecord(1))
    );

    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['insert', 'one'], {
        isFetching: false,
        isSuccess: true,
        isEmpty: false
      })
    );

    expect(event.data?.[0]).toMatchObject(createUserRecord(1));
  });

  it('should handle events for insertMany', async () => {
    clearRecords();
    clearObservers();

    const event = await observe(() =>
      insertMany(tableData)(createUserRecord(1), createUserRecord(2))
    );

    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['insert', 'many'], {
        isFetching: false,
        isSuccess: true,
        isEmpty: false
      })
    );

    expect(event.data).toHaveLength(2);
    expect(event.data?.[0]).toMatchObject(createUserRecord(1));
  });

  it('should handle events for insertAll', async () => {
    clearRecords();
    clearObservers();

    const event = await observe(() =>
      insertAll(tableData)(createUserRecord(1), createUserRecord(2))
    );

    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['insert', 'all'], {
        isFetching: false,
        isSuccess: true,
        isEmpty: false
      })
    );

    expect(event.data).toHaveLength(2);
    expect(event.data?.[0]).toMatchObject(createUserRecord(1));
  });
});
