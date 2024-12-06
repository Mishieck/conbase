import { describe, it } from "@std/testing";
import { expect } from "@std/expect";
import { deleteOne } from "./one.ts";
import { deleteMany } from "./many.ts";
import { deleteAll } from "./all.ts";
import { Remover } from "./delete.ts";

import {
  addUserRecord,
  clearUserRecords,
  createUserEvent,
  createUserRecord,
  createUserTableData,
  observeEvents,
  type User,
} from "../utils/tests.ts";
import { Table } from "../table/table.ts";

describe("removeOne", () => {
  it("should delete one record", () => {
    const tableData = createUserTableData();
    const id = "1";
    tableData.records.push([id, "Remover"]);
    expect(tableData.records).toHaveLength(1);
    deleteOne(tableData)("1");
    expect(tableData.records).toHaveLength(0);
  });

  it("should error if record does not exist", () => {
    const tableData = createUserTableData();
    const id = "1";
    tableData.records.push([id, "Remover"]);
    expect(tableData.records).toHaveLength(1);
    const { error } = deleteOne(tableData)("2");
    expect(error).toBeDefined();
    expect(tableData.records).toHaveLength(1);
  });
});

describe("deleteMany", () => {
  it("should delete many records", () => {
    const tableData = createUserTableData();

    tableData.records.push(
      ["1", "Remover 1"],
      ["2", "Remover 2"],
      ["3", "Remover 3"],
    );

    expect(tableData.records).toHaveLength(3);
    deleteMany(tableData)(["1", "2"]);
    expect(tableData.records).toHaveLength(1);
    expect(tableData.records[0]?.[0]).toEqual("3");
  });

  it("should error if any of the records does not exist", () => {
    const tableData = createUserTableData();

    tableData.records.push(
      ["1", "Remover 1"],
      ["2", "Remover 2"],
      ["3", "Remover 3"],
    );

    const { error } = deleteMany(tableData)(["1", "4"]);
    expect(error).toBeDefined();
    expect(error).toMatchObject({ cause: "NOT-EXISTS" });
    expect(tableData.records).toHaveLength(2);
  });
});

describe("deleteAll", () => {
  it("should delete all records", () => {
    const tableData = createUserTableData();

    tableData.records.push(
      ["1", "Remover 1"],
      ["2", "Remover 2"],
      ["3", "Remover 3"],
    );

    expect(tableData.records).toHaveLength(3);
    deleteAll(tableData)();
    expect(tableData.records).toHaveLength(0);
  });
});

describe("Remover", () => {
  it("should remove items from tableData using various methods", () => {
    const tableData = createUserTableData();
    const remove = Remover(tableData);

    tableData.records.push(
      ["1", "Remover 1"],
      ["2", "Remover 2"],
      ["3", "Remover 3"],
    );

    remove.one("1");
    expect(tableData.records).toHaveLength(2);

    remove.all();
    expect(tableData.records).toHaveLength(0);

    tableData.records.push(["1", "Remover 1"], ["2", "Remover 2"]);
    expect(tableData.records).toHaveLength(2);

    remove.many(["1", "2"]);
    expect(tableData.records).toHaveLength(0);
  });
});

describe("Remover Events", () => {
  const tableData = createUserTableData();
  const observe = observeEvents(tableData);
  const addRecord = addUserRecord(tableData);
  const clearRecords = clearUserRecords(tableData);
  const table = Table<User>("Users", ["id", "name"]);
  const user = createUserRecord(1);

  it("should handle events for deleteOne", async () => {
    clearRecords();
    addRecord(1);
    const event = await observe(() => deleteOne(tableData)("1"));
    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(["delete", "one"], {
        isSuccess: true,
        isEmpty: true,
        isFetching: false,
      }),
    );

    expect(event.data).toBeNull();

    table.delete.all();
    table.insert.one({ ...user });
    let data, dataWithoutCount;
    table.observe("delete-one", (d) => data = d);
    table.observe("delete", (d) => dataWithoutCount = d);
    table.delete.one(user.id);
    expect(table.select.all().data).toHaveLength(0);
    expect(data).toMatchObject(user);
    expect(dataWithoutCount).toBeInstanceOf(Array);
    expect(dataWithoutCount?.[0]).toMatchObject(user);
  });

  it("should handle events for deleteMany", async () => {
    clearRecords();
    addRecord(1);
    addRecord(2);
    addRecord(3);

    const event = await observe(() => deleteMany(tableData)(["1", "2"]));
    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(["delete", "many"], {
        isSuccess: true,
        isEmpty: false,
        isFetching: false,
      }),
    );

    expect(event.data).toBeNull();

    table.delete.all();
    table.insert.many([{ ...user }, { ...user, id: "2" }]);
    let data, dataWithoutCount;
    table.observe("delete-many", (d) => data = d);
    table.observe("delete", (d) => dataWithoutCount = d);
    table.delete.many([user.id, "2"]);
    expect(table.select.all().data).toHaveLength(0);
    expect(data).toBeInstanceOf(Array);
    expect(data).toHaveLength(2);
    expect(data?.[0]).toMatchObject(user);
    expect(dataWithoutCount).toHaveLength(2);
    expect(dataWithoutCount?.[0]).toMatchObject(user);
  });

  it("should handle events for deleteAll", async () => {
    clearRecords();
    addRecord(1);
    addRecord(2);
    const event = await observe(() => deleteAll(tableData)());
    expect(event).toBeDefined();

    expect(event).toMatchObject(
      createUserEvent(["delete", "all"], {
        isSuccess: true,
        isEmpty: true,
        isFetching: false,
      }),
    );

    expect(event.data).toBeNull();

    table.delete.all();
    table.insert.all([{ ...user }, { ...user, id: "2" }]);
    let data, dataWithoutCount;
    table.observe("delete-all", (d) => data = d);
    table.observe("delete", (d) => dataWithoutCount = d);
    table.delete.all();
    expect(table.select.all().data).toHaveLength(0);
    expect(data).toBeInstanceOf(Array);
    expect(data).toHaveLength(2);
    expect(data?.[0]).toMatchObject(user);
    expect(dataWithoutCount).toHaveLength(2);
    expect(dataWithoutCount?.[0]).toMatchObject(user);
  });
});
