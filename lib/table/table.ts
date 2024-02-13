import { Remover } from '../delete/delete';
import { databaseEventEmitter } from '../events/events';
import { Fetcher } from '../fetch/fetch';
import { Inserter } from '../insert/insert';
import { Selector } from '../select/select';
import type {
  DatabaseRecord,
  Fields,
  Index,
  TableData
} from '../types/database';
import type { Table as TableType } from '../types/table';
import { Updater } from '../update/update';

export const createFields = <Rec extends DatabaseRecord>(
  ...fieldNames: Array<keyof Rec>
): Fields<Rec> =>
  fieldNames.reduce(
    (fields, key, i) => ({ ...fields, [key]: i }),
    {} as Fields<Rec>
  );

export const createTableData = <Rec extends DatabaseRecord>(
  name: string,
  fields: Array<keyof Rec>,
  useIndex: boolean
): TableData<Rec> => {
  return {
    name,
    fields: createFields(...fields),
    index: useIndex ? ({} as Index<Rec>) : null,
    records: [],
    observers: []
  };
};

export const Table = <Rec extends DatabaseRecord>(
  name: string,
  fields: Array<keyof Rec>,
  useIndex: boolean = false
): TableType<Rec> => {
  const tableData = createTableData(name, fields, useIndex);

  return {
    insert: Inserter(tableData),
    select: Selector(tableData),
    update: Updater(tableData),
    delete: Remover(tableData),
    fetch: Fetcher(tableData),
    add: { observer: databaseEventEmitter.addObserver(tableData) }
  };
};
