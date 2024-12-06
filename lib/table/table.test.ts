import { describe, it } from "@std/testing";
import type { Fields } from "../types/database.ts";
import { createFields, createTableData, Table } from "./table.ts";
import { expect } from "@std/expect";

type User = { id: string; name: string };

const userRecord = { id: "1", name: "Name" };

const createUser = (id?: string): User => {
  const user = { ...userRecord };
  if (id) user.id = id;
  return user;
};

describe("createFields", () => {
  const expectedFields: Fields<User> = {
    id: 0,
    name: 1,
  };

  it("should create fields for a record", () => {
    expect(createFields("id", "name")).toMatchObject(expectedFields);
  });
});

describe("createTableData", () => {
  it("should create tableData", () => {
    const tableData = createTableData<User>("Users", ["id", "name"], false);

    expect(tableData).toMatchObject({
      name: "Users",
      fields: { id: 0, name: 1 },
      index: null,
    });

    expect(tableData.records).toBeInstanceOf(Array);
  });
});

describe("Table", () => {
  it("should perform operations on a tableData", () => {
    const handler = Table("Users", ["id", "name"]);
    handler.insert.one(createUser());
    expect(handler.select.one("1").data).toMatchObject(userRecord);
    const updatedName = "Updated Name";
    handler.update.one({ id: userRecord.id, name: updatedName });

    expect(handler.select.one("1").data).toMatchObject({
      ...userRecord,
      name: updatedName,
    });

    handler.delete.one("1");
    expect(handler.select.one(userRecord.id).error).toBeDefined();
  });
});
