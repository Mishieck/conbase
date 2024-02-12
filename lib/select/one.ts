import { DatabaseError } from '../error/error';
import { convertArrayToRecord } from '../record-converter/record-converter';
import type { TableData, DatabaseRecord, SelectOne } from '../types/database';

export const selectOne = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): SelectOne<Rec> => {
  const convert = convertArrayToRecord<Rec>(tableData.fields);

  return id => {
    let record = tableData.index
      ? tableData.records[tableData.index[id]]
      : tableData.records.find(record => record[0] === id);

    return {
      data: record ? convert(record) : null,
      error: record
        ? null
        : new DatabaseError(
            'NOT-EXISTS',
            `Record "${id}" not found in "${tableData.name}".`
          )
    };
  };
};
