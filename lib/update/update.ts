import type { DatabaseRecord, TableData } from "../types/database.ts";
import type { Update } from "../types/update.ts";
import { updateAll } from "./all.ts";
import { updateMany } from "./many.ts";
import { updateOne } from "./one.ts";

export const Updater = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>,
): Update<Rec> => ({
  one: updateOne(tableData),
  many: updateMany(tableData),
  all: updateAll(tableData),
});

export * from "./all.ts";
export * from "./one.ts";
export * from "./many.ts";
