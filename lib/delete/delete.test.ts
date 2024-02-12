import { describe, it, expect } from 'bun:test';
import type { Collection, Index } from '../types/database';
import { deleteOne } from './one';
import { deleteMany } from './many';
import { deleteAll } from './all';
import { Remover } from './delete';

type User = { id: string; name: string };

const createCollection = (
  index: Index<User> | null = null
): Collection<User> => ({
  name: 'Users',
  fields: { id: 0, name: 1 },
  records: [],
  index
});

describe('removeOne', () => {
  it('should delete one record', () => {
    const collection = createCollection();
    const id = '1';
    collection.records.push([id, 'Remover']);
    expect(collection.records).toHaveLength(1);
    deleteOne(collection)('1');
    expect(collection.records).toHaveLength(0);
  });

  it('should error if record does not exist', () => {
    const collection = createCollection();
    const id = '1';
    collection.records.push([id, 'Remover']);
    expect(collection.records).toHaveLength(1);
    const { error } = deleteOne(collection)('2');
    expect(error).toBeDefined();
    expect(collection.records).toHaveLength(1);
  });
});

describe('deleteMany', () => {
  it('should delete many records', () => {
    const collection = createCollection();

    collection.records.push(
      ['1', 'Remover 1'],
      ['2', 'Remover 2'],
      ['3', 'Remover 3']
    );

    expect(collection.records).toHaveLength(3);
    deleteMany(collection)('1', '2');
    expect(collection.records).toHaveLength(1);
    expect(collection.records[0]?.[0]).toEqual('3');
  });

  it('should error if any of the records does not exist', () => {
    const collection = createCollection();

    collection.records.push(
      ['1', 'Remover 1'],
      ['2', 'Remover 2'],
      ['3', 'Remover 3']
    );

    const { error } = deleteMany(collection)('1', '4');
    expect(error).toBeDefined();
    expect(error).toMatchObject({ cause: 'NOT-EXISTS' });
    expect(collection.records).toHaveLength(2);
  });
});

describe('deleteAll', () => {
  it('should delete all records', () => {
    const collection = createCollection();

    collection.records.push(
      ['1', 'Remover 1'],
      ['2', 'Remover 2'],
      ['3', 'Remover 3']
    );

    expect(collection.records).toHaveLength(3);
    deleteAll(collection)();
    expect(collection.records).toHaveLength(0);
  });
});

describe('Remover', () => {
  it('should remove items from collection using various methods', () => {
    const collection = createCollection();
    const remove = Remover(collection);

    collection.records.push(
      ['1', 'Remover 1'],
      ['2', 'Remover 2'],
      ['3', 'Remover 3']
    );

    remove.one('1');
    expect(collection.records).toHaveLength(2);

    remove.all();
    expect(collection.records).toHaveLength(0);

    collection.records.push(['1', 'Remover 1'], ['2', 'Remover 2']);
    expect(collection.records).toHaveLength(2);

    remove.many('1', '2');
    expect(collection.records).toHaveLength(0);
  });
});
