import type { DatabaseRecord, TableData } from "../types/database.ts";
import type { Insert } from "../types/insert.ts";
import { insertAll } from "./all.ts";
import { insertMany } from "./many.ts";
import { insertOne } from "./one.ts";

export const Inserter = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>,
): Insert<Rec> => ({
  one: insertOne(tableData),
  many: insertMany(tableData),
  all: insertAll(tableData),
});

export * from "./all.ts";
export * from "./one.ts";
export * from "./many.ts";
