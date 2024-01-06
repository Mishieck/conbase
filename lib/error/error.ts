export type DatabaseErrorCause = 'EXISTS' | 'NOT-EXISTS';

export class DatabaseError extends Error {
  constructor(cause: DatabaseErrorCause, message: string) {
    super(message, { cause });
    super.name = 'DatabaseError';
  }
}
