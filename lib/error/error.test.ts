import { describe, it, expect } from 'bun:test';
import { DatabaseError, type DatabaseErrorCause } from './error';

describe('DatabaseError', () => {
  it('should create error', () => {
    const cause: DatabaseErrorCause = 'EXISTS';
    const message = 'Record already exists';
    const error = new DatabaseError(cause, message);

    expect(error.name).toBe('DatabaseError');
    expect(error.cause).toBe(cause);
    expect(error.message).toBe(message);
    expect(error).toBeInstanceOf(Error);
  });
});
