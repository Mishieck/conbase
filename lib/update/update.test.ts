import { describe, it, expect } from 'bun:test';
import type { Collection, Index } from '../types/database';
import { updateOne } from './one';
import { updateMany } from './many';
import { Updater } from './update';

type User = { id: string; name: string };

const createCollection = (
  index: Index<User> | null = null
): Collection<User> => ({
  name: 'Users',
  fields: { id: 0, name: 1 },
  records: [],
  index
});

describe('updateOne', () => {
  it('should update one record', () => {
    const collection = createCollection();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;

    collection.records.push(['1', initialName]);
    expect(collection.records[0] ?? {}).toContain(initialName);

    updateOne(collection)({ id: '1', name: updatedName });
    expect(collection.records[0] ?? {}).toContain(updatedName);
  });

  it('should error if record does not exist', () => {
    const collection = createCollection();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;

    collection.records.push(['1', initialName]);
    expect(collection.records[0] ?? {}).toContain(initialName);

    const { error } = updateOne(collection)({ id: '2', name: updatedName });
    expect(error).toBeDefined();
    expect(error).toMatchObject({ cause: 'NOT-EXISTS' });
  });
});

describe('updateMany', () => {
  const createName = (firstName: string) => (secondName: string) =>
    `${firstName}${secondName}`;

  it('should update many records', () => {
    const collection = createCollection();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;

    collection.records.push(
      ['1', createName(initialName)('1')],
      ['2', createName(initialName)('2')]
    );

    expect(collection.records[0]).toContain(createName(initialName)('1'));
    expect(collection.records[1]).toContain(createName(initialName)('2'));

    updateMany(collection)(
      { id: '1', name: createName(updatedName)('1') },
      { id: '2', name: createName(updatedName)('2') }
    );

    expect(collection.records[0]).toContain(createName(updatedName)('1'));
    expect(collection.records[1]).toContain(createName(updatedName)('2'));
  });

  it('should error if any of the records does not exist', () => {
    const collection = createCollection();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;

    collection.records.push(
      ['1', createName(initialName)('1')],
      ['2', createName(initialName)('2')]
    );

    expect(collection.records[0]).toContain(createName(initialName)('1'));
    expect(collection.records[1]).toContain(createName(initialName)('2'));

    const { error } = updateMany(collection)(
      { id: '1', name: createName(updatedName)('1') },
      { id: '3', name: createName(updatedName)('3') }
    );

    expect(error).toBeDefined();
    expect(error).toMatchObject({ cause: 'NOT-EXISTS' });
    expect(collection.records[0]).toContain(createName(updatedName)('1'));
    expect(collection.records[1]).toContain(createName(initialName)('2'));
  });
});

describe('Updater', () => {
  const createName = (firstName: string) => (secondName: string) =>
    `${firstName}${secondName}`;

  it('should update records using various methods', () => {
    const collection = createCollection();
    const initialName = 'Updater';
    const updatedName = `${initialName} Updated`;
    const update = Updater(collection);

    collection.records.push(
      ['1', createName(initialName)('1')],
      ['2', createName(initialName)('2')]
    );

    expect(collection.records[0]).toContain(createName(initialName)('1'));
    expect(collection.records[1]).toContain(createName(initialName)('2'));

    update.one({ id: '1', name: createName(updatedName)('1') });
    expect(collection.records[0]).toContain(createName(updatedName)('1'));

    update.many(
      { id: '1', name: createName(updatedName)('2') },
      { id: '2', name: createName(updatedName)('3') }
    );

    expect(collection.records[0]).toContain(createName(updatedName)('2'));
    expect(collection.records[1]).toContain(createName(updatedName)('3'));
  });
});
