import { DatabaseError, Table } from "jsr:@mishieck/conbase@0.1";
import {
  assertEquals,
  assertExists,
  assertInstanceOf,
} from "jsr:@std/assert@1";

type Todo = {
  id: string;
  content: string;
  done?: boolean;
};

const todoList = Table<Todo>("TodoList", ["id", "content", "done"]);

const firstId = crypto.randomUUID();
const secondId = crypto.randomUUID();
const thirdId = crypto.randomUUID();

// Insert

todoList.insert.one({ id: firstId, content: "Learn Conbase." });

todoList.insert.many([
  {
    id: secondId,
    content: "Learn Deno.",
  },
  {
    id: thirdId,
    content: "Learn Bun.",
  },
]);

// Select

let item = todoList.select.one(firstId).data;
assertExists(item);
assertEquals(item.content, "Learn Conbase.");

let items = todoList.select.many([secondId, thirdId]).data;
assertExists(items);
const [second, third] = items;
assertEquals(second.content, "Learn Deno.");
assertEquals(third.content, "Learn Bun.");

items = todoList.select.all().data;
assertExists(items);
assertEquals(items.length, 3);

assertInstanceOf(todoList.select.one(crypto.randomUUID()).error, DatabaseError);

// Update

item = todoList.update.one({ id: firstId, done: true }).data;
assertExists(item);
assertEquals(item.done, true);

items = todoList
  .update
  .many([{ id: firstId, done: false }, { id: secondId, done: true }])
  .data;

assertExists(items);
assertEquals(items.map(({ done }) => done), [false, true]);

items = todoList.update.all((item) => ({ ...item, done: true })).data;
assertExists(items);
assertEquals(items.find(({ done }) => !done), undefined);

assertInstanceOf(
  todoList.update.one({ id: crypto.randomUUID(), done: true }).error,
  DatabaseError,
);

// Delete

todoList.delete.one(firstId).data;
let result = todoList.select.one(firstId);
assertEquals(result.data, null);
assertInstanceOf(result.error, Error);

todoList.delete.many([secondId]);
result = todoList.select.one(secondId);
assertEquals(result.data, null);
assertInstanceOf(result.error, DatabaseError);

todoList.delete.all();
const { data } = todoList.select.all();
assertExists(data);
assertEquals(data.length, 0);

assertInstanceOf(todoList.delete.one(crypto.randomUUID()).error, DatabaseError);
