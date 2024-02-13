import { databaseEventEmitter } from '../events/events';
import type { TableData, DatabaseRecord } from '../types/database';
import type { DeleteMany } from '../types/delete';
import { deleteOne } from './one';

export const deleteMany = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): DeleteMany<Rec> => {
  const remove = deleteOne(tableData);
  const notifyObservers = databaseEventEmitter.notifyObservers(tableData);

  return ids => {
    const results = ids.map(id => remove(id, false));
    const maybeError = results.find(({ error }) => error)?.error;

    notifyObservers(
      ['delete', 'many'],
      {
        isFetching: false,
        isSuccess: !maybeError,
        isEmpty: tableData.records.length === 0
      },
      null
    );

    return { data: null, error: maybeError ?? null };
  };
};
