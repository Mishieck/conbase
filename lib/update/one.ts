import { DatabaseError } from '../error/error';
import { convertArrayToRecord } from '../record-converter/record-converter';
import type { TableData, DatabaseRecord } from '../types/database';
import type { UpdateOne } from '../types/update';

export const updateOne = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): UpdateOne<Rec> => {
  const convertToRecord = convertArrayToRecord<Rec>(tableData.fields);

  return update => {
    const record = tableData.records.find(
      rec => rec[tableData.fields.id] === update.id
    );

    if (!record)
      return {
        data: null,
        error: new DatabaseError(
          'NOT-EXISTS',
          `Couldn't find record ${update.id}`
        )
      };

    for (const field in update)
      record[tableData.fields[field as keyof Rec]] = update[field as keyof Rec];

    return { data: convertToRecord(record), error: null };
  };
};
