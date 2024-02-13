import { describe, it, expect } from 'bun:test';
import {
  createUserEvent,
  createUserTableData,
  observeEvents
} from '../utils/tests';
import { Fetcher } from './fetch';

describe('Fetcher', () => {
  const tableData = createUserTableData();
  const observe = observeEvents(tableData);
  const fetch = Fetcher(tableData);

  it('should fetch one record', async () => {
    const event = await observe(() => fetch.one());

    expect(event).toMatchObject(
      createUserEvent(['fetch', 'one'], {
        isEmpty: true,
        isFetching: true,
        isSuccess: true
      })
    );
  });

  it('should fetch many records', async () => {
    const event = await observe(() => fetch.many());

    expect(event).toMatchObject(
      createUserEvent(['fetch', 'many'], {
        isEmpty: true,
        isFetching: true,
        isSuccess: true
      })
    );
  });

  it('should fetch all records', async () => {
    const event = await observe(() => fetch.all());

    expect(event).toMatchObject(
      createUserEvent(['fetch', 'all'], {
        isEmpty: true,
        isFetching: true,
        isSuccess: true
      })
    );
  });
});
