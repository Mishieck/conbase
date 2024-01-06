import { describe, it, expect } from 'bun:test';
import type { Collection, Index } from '../types/database';
import { insertOne } from './one';
import { insertMany } from './many';
import { DatabaseError } from '../error/error';

type User = { id: string; name: string };

const createCollection = (
  index: Index<string> | null = null
): Collection<User> => ({
  name: 'Users',
  fields: { id: 0, name: 1 },
  records: [],
  index
});

const user: User = { id: '1', name: 'Name' };

describe('insertOne', () => {
  it('should insert a record', () => {
    const collection = createCollection();
    const insert = insertOne(collection);
    insert({ ...user });
    expect(collection.records[0]).toEqual([user.id, user.name]);
  });

  it('should update index', () => {
    const collection = createCollection({});
    const insert = insertOne(collection);

    insert({ ...user });
    insert({ ...user, id: '2' });

    expect(collection.records).toHaveLength(2);
    expect(collection.index).toEqual({ '1': 0, '2': 1 });
  });

  it('should not allow duplicate records', () => {
    const collection = createCollection();
    const indexedCollection = createCollection({});
    const insert = insertOne(collection);
    const insertIndexed = insertOne(indexedCollection);

    insert({ ...user });
    insertIndexed({ ...user });
    const { error } = insert({ ...user });
    const { error: errorIndexed } = insertIndexed({ ...user });

    expect(collection.records).toHaveLength(1);
    expect(error).toBeInstanceOf(DatabaseError);
    expect(errorIndexed).toBeInstanceOf(DatabaseError);
    expect(error).toMatchObject({ cause: 'EXISTS' });
  });
});

describe('insertMany', () => {
  it('should insert multiple records', () => {
    const collection = createCollection();
    const insert = insertMany(collection);
    insert({ ...user }, { ...user, id: '2' });

    expect(collection.records).toHaveLength(2);
    expect(collection.records[0]).toEqual([user.id, user.name]);
  });
});
