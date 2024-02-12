import { DatabaseError } from '../error/error';
import { convertArrayToRecord } from '../record-converter/record-converter';
import type { Collection, DatabaseRecord, UpdateOne } from '../types/database';

export const updateOne = <Rec extends DatabaseRecord>(
  collection: Collection<Rec>
): UpdateOne<Rec> => {
  const convertToRecord = convertArrayToRecord<Rec>(collection.fields);

  return update => {
    const record = collection.records.find(
      rec => rec[collection.fields.id] === update.id
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
      record[collection.fields[field]] = update[field as keyof Rec];

    return { data: convertToRecord(record), error: null };
  };
};
