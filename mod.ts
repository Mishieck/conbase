/**
 * A simple in-memory database. It improves memory performance by storing an array
 * of objects as an array of arrays.
 *
 * @example
 * ```ts
 * import { DatabaseError, Table } from "jsr:@mishieck/conbase@0.1";
 * import {
 *   assertEquals,
 *   assertExists,
 *   assertInstanceOf,
 * } from "jsr:@std/assert@1";
 *
 * type Todo = {
 *   id: string;
 *   content: string;
 *   done?: boolean;
 * };
 *
 * const todoList = Table<Todo>("TodoList", ["id", "content", "done"]);
 *
 * const firstId = crypto.randomUUID();
 * const secondId = crypto.randomUUID();
 * const thirdId = crypto.randomUUID();
 *
 * // Insert
 *
 * todoList.insert.one({ id: firstId, content: "Learn Conbase." });
 *
 * todoList.insert.many([
 *   {
 *     id: secondId,
 *     content: "Learn Deno.",
 *   },
 *   {
 *     id: thirdId,
 *     content: "Learn Bun.",
 *   },
 * ]);
 *
 * // Select
 *
 * let item = todoList.select.one(firstId).data;
 * assertExists(item);
 * assertEquals(item.content, "Learn Conbase.");
 *
 * let items = todoList.select.many([secondId, thirdId]).data;
 * assertExists(items);
 * const [second, third] = items;
 * assertEquals(second.content, "Learn Deno.");
 * assertEquals(third.content, "Learn Bun.");
 *
 * items = todoList.select.all().data;
 * assertExists(items);
 * assertEquals(items.length, 3);
 *
 * assertInstanceOf(todoList.select.one(crypto.randomUUID()).error, DatabaseError);
 *
 * // Update
 *
 * item = todoList.update.one({ id: firstId, done: true }).data;
 * assertExists(item);
 * assertEquals(item.done, true);
 *
 * items = todoList
 *   .update
 *   .many([{ id: firstId, done: false }, { id: secondId, done: true }])
 *   .data;
 *
 * assertExists(items);
 * assertEquals(items.map(({ done }) => done), [false, true]);
 *
 * items = todoList.update.all((item) => ({ ...item, done: true })).data;
 * assertExists(items);
 * assertEquals(items.find(({ done }) => !done), undefined);
 *
 * assertInstanceOf(
 *   todoList.update.one({ id: crypto.randomUUID(), done: true }).error,
 *   DatabaseError,
 * );
 *
 * // Delete
 *
 * todoList.delete.one(firstId).data;
 * let result = todoList.select.one(firstId);
 * assertEquals(result.data, null);
 * assertInstanceOf(result.error, Error);
 *
 * todoList.delete.many([secondId]);
 * result = todoList.select.one(secondId);
 * assertEquals(result.data, null);
 * assertInstanceOf(result.error, DatabaseError);
 *
 * todoList.delete.all();
 * const { data } = todoList.select.all();
 * assertExists(data);
 * assertEquals(data.length, 0);
 *
 * assertInstanceOf(todoList.delete.one(crypto.randomUUID()).error, DatabaseError);
 *
 * ```
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
