import type { DatabaseRecord, TableData } from "../types/database.ts";
import type { Select } from "../types/select.ts";
import { selectAll } from "./all.ts";
import { selectMany } from "./many.ts";
import { selectOne } from "./one.ts";

export const Selector = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>,
): Select<Rec> => ({
  one: selectOne(tableData),
  many: selectMany(tableData),
  all: selectAll(tableData),
});

export * from "./all.ts";
export * from "./one.ts";
export * from "./many.ts";
