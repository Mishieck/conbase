/**
 * A simple in-memory database. It improves memory performance by storing an array
 * of objects as an array of arrays.
 *
 * @example
 *
 * @module
 */

/* Types */

export * as DatabaseTypes from "./lib/types/database.ts";
export * as DeleteTypes from "./lib/types/delete.ts";
export * as EventsTypes from "./lib/types/events.ts";
export * as InsertTypes from "./lib/types/insert.ts";
export * as OperationsTypes from "./lib/types/operations.ts";
export * as SelectTypes from "./lib/types/select.ts";
export * as TableTypes from "./lib/types/table.ts";
export * as UpdateTypes from "./lib/types/update.ts";
export * as FetchTypes from "./lib/types/fetch.ts";

/* Operations */

export * from "./lib/delete/delete.ts";
export * from "./lib/insert/insert.ts";
export * from "./lib/select/select.ts";
export * from "./lib/update/update.ts";
export * from "./lib/fetch/fetch.ts";

/* Other */

export * from "./lib/record-converter/record-converter.ts";
export * from "./lib/table/table.ts";
export * from "./lib/events/events.ts";
export * from "./lib/error/error.ts";
