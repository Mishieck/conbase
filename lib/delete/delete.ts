import type { DatabaseRecord, TableData } from "../types/database.ts";
import type { Delete } from "../types/delete.ts";
import { deleteAll } from "./all.ts";
import { deleteMany } from "./many.ts";
import { deleteOne } from "./one.ts";

export const Remover = <Rec extends DatabaseRecord>(
  tableData: TableData<Rec>,
): Delete<Rec> => ({
  one: deleteOne(tableData),
  many: deleteMany(tableData),
  all: deleteAll(tableData),
});

export * from "./all.ts";
export * from "./one.ts";
export * from "./many.ts";
