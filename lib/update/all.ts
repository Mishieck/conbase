import {
  convertArrayToRecord,
  convertRecordToArray
} from '../record-converter/record-converter';
import type { TableData, DatabaseRecord } from '../types/database';
import type { UpdateAll } from '../types/update';

export const updateAll = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>
): UpdateAll<Rec> => {
  const convertToRecord = convertArrayToRecord(tableData.fields);
  const convertToArray = convertRecordToArray(tableData.fields);

  return update => {
    tableData.records = tableData.records.map(record =>
      convertToArray(update(convertToRecord(record)))
    );

    return {
      data: null,
      error: null
    };
  };
};
