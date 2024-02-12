import { DatabaseError } from '../error/error';
import type { TableData, DatabaseRecord } from '../types/database';
import type { DeleteOne } from '../types/delete';

export const deleteOne = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): DeleteOne<Rec> => {
  return id => {
    const idIndex = tableData.fields.id;

    const indexOfRecord = tableData.records.findIndex(
      rec => rec[idIndex] === id
    );

    if (indexOfRecord < 0)
      return {
        data: null,
        error: new DatabaseError('NOT-EXISTS', `Couldn't find record ${id}`)
      };

    tableData.records.splice(indexOfRecord, 1);
    return { data: null, error: null };
  };
};
