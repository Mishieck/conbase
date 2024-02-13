import { describe, it, expect } from 'bun:test';
import { deleteOne } from './one';
import { deleteMany } from './many';
import { deleteAll } from './all';
import { Remover } from './delete';

import {
  addUserRecord,
  clearUserRecords,
  createUserEvent,
  createUserTableData,
  observeEvents
} from '../utils/tests';

describe('removeOne', () => {
  it('should delete one record', () => {
    const tableData = createUserTableData();
    const id = '1';
    tableData.records.push([id, 'Remover']);
    expect(tableData.records).toHaveLength(1);
    deleteOne(tableData)('1');
    expect(tableData.records).toHaveLength(0);
  });

  it('should error if record does not exist', () => {
    const tableData = createUserTableData();
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
    const tableData = createUserTableData();

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
    const tableData = createUserTableData();

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
    const tableData = createUserTableData();

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
    const tableData = createUserTableData();
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

describe('Remover Events', () => {
  const tableData = createUserTableData();
  const observe = observeEvents(tableData);
  const addRecord = addUserRecord(tableData);
  const clearRecords = clearUserRecords(tableData);

  it('should handle events for deleteOne', async () => {
    clearRecords();
    addRecord(1);
    const event = await observe(() => deleteOne(tableData)('1'));
    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['delete', 'one'], {
        isSuccess: true,
        isEmpty: true,
        isFetching: false
      })
    );

    expect(event.data).toBeNull();
  });

  it('should handle events for deleteMany', async () => {
    clearRecords();
    addRecord(1);
    addRecord(2);
    addRecord(3);

    const event = await observe(() => deleteMany(tableData)('1', '2'));
    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['delete', 'many'], {
        isSuccess: true,
        isEmpty: false,
        isFetching: false
      })
    );

    expect(event.data).toBeNull();
  });

  it('should handle events for deleteAll', async () => {
    clearRecords();
    addRecord(1);
    addRecord(2);
    const event = await observe(() => deleteAll(tableData)());
    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['delete', 'all'], {
        isSuccess: true,
        isEmpty: true,
        isFetching: false
      })
    );

    expect(event.data).toBeNull();
  });
});
