import { describe, it, expect } from 'bun:test';
import type { TableData, Index } from '../types/database';
import { deleteOne } from './one';
import { deleteMany } from './many';
import { deleteAll } from './all';
import { Remover } from './delete';

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

describe('removeOne', () => {
  it('should delete one record', () => {
    const tableData = createTableData();
    const id = '1';
    tableData.records.push([id, 'Remover']);
    expect(tableData.records).toHaveLength(1);
    deleteOne(tableData)('1');
    expect(tableData.records).toHaveLength(0);
  });

  it('should error if record does not exist', () => {
    const tableData = createTableData();
    const id = '1';
    tableData.records.push([id, 'Remover']);
    expect(tableData.records).toHaveLength(1);
    const { error } = deleteOne(tableData)('2');
    expect(error).toBeDefined();
    expect(tableData.records).toHaveLength(1);
  });
});

describe('deleteMany', () => {
  it('should delete many records', () => {
    const tableData = createTableData();

    tableData.records.push(
      ['1', 'Remover 1'],
      ['2', 'Remover 2'],
      ['3', 'Remover 3']
    );

    expect(tableData.records).toHaveLength(3);
    deleteMany(tableData)('1', '2');
    expect(tableData.records).toHaveLength(1);
    expect(tableData.records[0]?.[0]).toEqual('3');
  });

  it('should error if any of the records does not exist', () => {
    const tableData = createTableData();

    tableData.records.push(
      ['1', 'Remover 1'],
      ['2', 'Remover 2'],
      ['3', 'Remover 3']
    );

    const { error } = deleteMany(tableData)('1', '4');
    expect(error).toBeDefined();
    expect(error).toMatchObject({ cause: 'NOT-EXISTS' });
    expect(tableData.records).toHaveLength(2);
  });
});

describe('deleteAll', () => {
  it('should delete all records', () => {
    const tableData = createTableData();

    tableData.records.push(
      ['1', 'Remover 1'],
      ['2', 'Remover 2'],
      ['3', 'Remover 3']
    );

    expect(tableData.records).toHaveLength(3);
    deleteAll(tableData)();
    expect(tableData.records).toHaveLength(0);
  });
});

describe('Remover', () => {
  it('should remove items from tableData using various methods', () => {
    const tableData = createTableData();
    const remove = Remover(tableData);

    tableData.records.push(
      ['1', 'Remover 1'],
      ['2', 'Remover 2'],
      ['3', 'Remover 3']
    );

    remove.one('1');
    expect(tableData.records).toHaveLength(2);

    remove.all();
    expect(tableData.records).toHaveLength(0);

    tableData.records.push(['1', 'Remover 1'], ['2', 'Remover 2']);
    expect(tableData.records).toHaveLength(2);

    remove.many('1', '2');
    expect(tableData.records).toHaveLength(0);
  });
});
