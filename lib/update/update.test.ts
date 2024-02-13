import { describe, it, expect } from 'bun:test';
import type { TableData, Index } from '../types/database';
import { updateOne } from './one';
import { updateMany } from './many';
import { Updater } from './update';
import { updateAll } from './all';
import {
  clearUserObservers,
  clearUserRecords,
  createUserArray,
  createUserEvent,
  createUserRecord,
  createUserTableData,
  observeEvents
} from '../utils/tests';

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

describe('updateOne', () => {
  it('should update one record', () => {
    const tableData = createTableData();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;

    tableData.records.push(['1', initialName]);
    expect(tableData.records[0] ?? {}).toContain(initialName);

    updateOne(tableData)({ id: '1', name: updatedName });
    expect(tableData.records[0] ?? {}).toContain(updatedName);
  });

  it('should error if record does not exist', () => {
    const tableData = createTableData();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;

    tableData.records.push(['1', initialName]);
    expect(tableData.records[0] ?? {}).toContain(initialName);

    const { error } = updateOne(tableData)({ id: '2', name: updatedName });
    expect(error).toBeDefined();
    expect(error).toMatchObject({ cause: 'NOT-EXISTS' });
  });
});

describe('updateMany', () => {
  const createName = (firstName: string) => (secondName: string) =>
    `${firstName}${secondName}`;

  it('should update many records', () => {
    const tableData = createTableData();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;

    tableData.records.push(
      ['1', createName(initialName)('1')],
      ['2', createName(initialName)('2')]
    );

    expect(tableData.records[0]).toContain(createName(initialName)('1'));
    expect(tableData.records[1]).toContain(createName(initialName)('2'));

    updateMany(tableData)(
      { id: '1', name: createName(updatedName)('1') },
      { id: '2', name: createName(updatedName)('2') }
    );

    expect(tableData.records[0]).toContain(createName(updatedName)('1'));
    expect(tableData.records[1]).toContain(createName(updatedName)('2'));
  });

  it('should error if any of the records does not exist', () => {
    const tableData = createTableData();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;

    tableData.records.push(
      ['1', createName(initialName)('1')],
      ['2', createName(initialName)('2')]
    );

    expect(tableData.records[0]).toContain(createName(initialName)('1'));
    expect(tableData.records[1]).toContain(createName(initialName)('2'));

    const { error } = updateMany(tableData)(
      { id: '1', name: createName(updatedName)('1') },
      { id: '3', name: createName(updatedName)('3') }
    );

    expect(error).toBeDefined();
    expect(error).toMatchObject({ cause: 'NOT-EXISTS' });
    expect(tableData.records[0]).toContain(createName(updatedName)('1'));
    expect(tableData.records[1]).toContain(createName(initialName)('2'));
  });
});

describe('updateAll', () => {
  const createName = (firstName: string) => (secondName: string) =>
    `${firstName}${secondName}`;

  it('should update all records', () => {
    const tableData = createTableData();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;

    tableData.records.push(
      ['1', createName(initialName)('1')],
      ['2', createName(initialName)('2')]
    );

    expect(tableData.records[0]).toContain(createName(initialName)('1'));
    expect(tableData.records[1]).toContain(createName(initialName)('2'));

    updateAll(tableData)(record => ({
      ...record,
      name: createName(updatedName)(record.id)
    }));

    expect(tableData.records[0]).toContain(createName(updatedName)('1'));
    expect(tableData.records[1]).toContain(createName(updatedName)('2'));
  });

  it('should error if any of the records does not exist', () => {
    const tableData = createTableData();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;

    tableData.records.push(
      ['1', createName(initialName)('1')],
      ['2', createName(initialName)('2')]
    );

    expect(tableData.records[0]).toContain(createName(initialName)('1'));
    expect(tableData.records[1]).toContain(createName(initialName)('2'));

    const result = updateAll(tableData)(record => ({
      ...record,
      name: createName(updatedName)(String(Number(record.id) + 1))
    }));

    expect(result).toMatchObject({ error: null });
    expect(tableData.records[0]).toContain(createName(updatedName)('2'));
    expect(tableData.records[1]).toContain(createName(updatedName)('3'));
  });
});

describe('Updater', () => {
  const createName = (firstName: string) => (secondName: string) =>
    `${firstName}${secondName}`;

  it('should update records using various methods', () => {
    const tableData = createTableData();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;
    const update = Updater(tableData);

    tableData.records.push(
      ['1', createName(initialName)('1')],
      ['2', createName(initialName)('2')]
    );

    expect(tableData.records[0]).toContain(createName(initialName)('1'));
    expect(tableData.records[1]).toContain(createName(initialName)('2'));

    update.one({ id: '1', name: createName(updatedName)('1') });
    expect(tableData.records[0]).toContain(createName(updatedName)('1'));

    update.many(
      { id: '1', name: createName(updatedName)('2') },
      { id: '2', name: createName(updatedName)('3') }
    );

    expect(tableData.records[0]).toContain(createName(updatedName)('2'));
    expect(tableData.records[1]).toContain(createName(updatedName)('3'));
  });
});

describe('Updater Events', () => {
  const tableData = createUserTableData();
  const clearObservers = clearUserObservers(tableData);
  const clearRecords = clearUserRecords(tableData);
  const observe = observeEvents(tableData);

  it('should handle events for updateOne', async () => {
    clearRecords();
    clearObservers();

    tableData.records.push(createUserArray(1));

    const event = await observe(() =>
      updateOne(tableData)(createUserRecord(1, 'Updated'))
    );

    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['update', 'one'], {
        isFetching: false,
        isSuccess: true,
        isEmpty: false
      })
    );

    expect(event.data?.[0]).toMatchObject(createUserRecord(1, 'Updated'));
  });

  it('should handle events for updateMany', async () => {
    clearRecords();
    clearObservers();

    tableData.records.push(createUserArray(1), createUserArray(2));

    const event = await observe(() =>
      updateMany(tableData)(
        createUserRecord(1, 'Updated'),
        createUserRecord(2, 'Updated')
      )
    );

    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['update', 'many'], {
        isFetching: false,
        isSuccess: true,
        isEmpty: false
      })
    );

    expect(event.data?.[0]).toMatchObject(createUserRecord(1, 'Updated'));
  });

  it('should handle events for updateAll', async () => {
    clearRecords();
    clearObservers();

    tableData.records.push(createUserArray(1), createUserArray(2));

    const event = await observe(() =>
      updateAll(tableData)(record => ({ ...record, name: 'Updated' }))
    );

    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(['update', 'all'], {
        isFetching: false,
        isSuccess: true,
        isEmpty: false
      })
    );

    expect(event.data?.[0]).toMatchObject(createUserRecord(1, 'Updated'));
  });
});
