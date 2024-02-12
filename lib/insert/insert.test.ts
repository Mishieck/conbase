import { describe, it, expect } from 'bun:test';
import type { TableData, Index } from '../types/database';
import { insertOne } from './one';
import { insertMany } from './many';
import { DatabaseError } from '../error/error';
import { Inserter } from './insert';
import { insertAll } from './all';

type User = { id: string; name: string };

const createTableData = (
  index: Index<User> | null = null
): TableData<User> => ({
  name: 'Users',
  fields: { id: 0, name: 1 },
  records: [],
  index,
  observers: []
});

const user: User = { id: '1', name: 'Name' };

describe('insertOne', () => {
  it('should insert a record', () => {
    const tableData = createTableData();
    const insert = insertOne(tableData);
    insert({ ...user });
    expect(tableData.records[0]).toEqual([user.id, user.name]);
  });

  it('should update index', () => {
    const tableData = createTableData({});
    const insert = insertOne(tableData);

    insert({ ...user });
    insert({ ...user, id: '2' });

    expect(tableData.records).toHaveLength(2);
    expect(tableData.index).toEqual({ '1': 0, '2': 1 });
  });

  it('should not allow duplicate records', () => {
    const tableData = createTableData();
    const indexedTableData = createTableData({});
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
    const tableData = createTableData();
    const insert = insertMany(tableData);
    insert({ ...user }, { ...user, id: '2' });

    expect(tableData.records).toHaveLength(2);
    expect(tableData.records[0]).toEqual([user.id, user.name]);
  });
});

describe('insertAll', () => {
  it('should insert multiple records', () => {
    const tableData = createTableData();
    const insert = insertAll(tableData);
    insert({ ...user }, { ...user, id: '2' });

    expect(tableData.records).toHaveLength(2);
    expect(tableData.records[0]).toEqual([user.id, user.name]);
  });
});

describe('Inserter', () => {
  it('should insert records using various methods', () => {
    const tableData = createTableData();
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
