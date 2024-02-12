import { describe, it, expect } from 'bun:test';
import type { Fields } from '../types/database';
import {
  CollectionHandler,
  createCollection,
  createFields
} from './collection-handler';

type User = { id: string; name: string };

const userRecord = { id: '1', name: 'Name' };

const createUser = (id?: string): User => {
  const user = { ...userRecord };
  if (id) user.id = id;
  return user;
};

describe('createFields', () => {
  const expectedFields: Fields<User> = {
    id: 0,
    name: 1
  };

  it('should create fields for a record', () => {
    expect(createFields('id', 'name')).toMatchObject(expectedFields);
  });
});

describe('createCollection', () => {
  it('should create collection', () => {
    const collection = createCollection<User>('Users', ['id', 'name'], false);

    expect(collection).toMatchObject({
      name: 'Users',
      fields: { id: 0, name: 1 },
      index: null
    });

    expect(collection.records).toBeInstanceOf(Array);
  });
});

describe('CollectionHandler', () => {
  it('should perform operations on a collection', () => {
    const handler = CollectionHandler('Users', ['id', 'name']);
    handler.insert.one(createUser());
    expect(handler.select.one('1').data).toMatchObject(userRecord);
    const updatedName = 'Updated Name';
    handler.update.one({ id: userRecord.id, name: updatedName });

    expect(handler.select.one('1').data).toMatchObject({
      ...userRecord,
      name: updatedName
    });

    handler.delete.one('1');
    expect(handler.select.one(userRecord.id).error).toBeDefined();
  });
});
