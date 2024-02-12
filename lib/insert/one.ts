import { DatabaseError } from '../error/error';
import { convertRecordToArray } from '../record-converter/record-converter';
import type { TableData, DatabaseRecord } from '../types/database';
import type { InsertOne } from '../types/insert';

export const insertOne =
  <Rec extends DatabaseRecord>(tableData: TableData<Rec>): InsertOne<Rec> =>
  record => {
    let exists: boolean;

    if (tableData.index) exists = record.id in tableData.index;
    else exists = !!tableData.records.find(([id]) => id === record.id);

    if (exists) {
      const message = `Record '${record.id}' already exists in '${tableData.name}'.`;

      return {
        data: null,
        error: new DatabaseError('EXISTS', message)
      };
    }

    tableData.records.push(convertRecordToArray(tableData.fields)(record));

    if (tableData.index)
      tableData.index[record.id as Rec['id']] = tableData.records.length - 1;

    return { data: null, error: null };
  };
