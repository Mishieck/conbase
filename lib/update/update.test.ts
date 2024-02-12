import { describe, it, expect } from 'bun:test';
import type { TableData, Index } from '../types/database';
import { updateOne } from './one';
import { updateMany } from './many';
import { Updater } from './update';
import { updateAll } from './all';

type User = { id: string; name: string };

const createTableData = (
  index: Index<User> | null = null
): TableData<User> => ({
  name: 'Users',
  fields: { id: 0, name: 1 },
  records: [],
  index
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

    expect(result).toMatchObject({ data: null, error: null });
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
