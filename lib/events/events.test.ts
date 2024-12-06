import { describe, it } from "@std/testing";
import {
  createUserEvent,
  createUserRecord,
  type User,
} from "../utils/tests.ts";
import type { Operation, OperationName } from "../types/operations.ts";
import { IsOperation, operationCounts, operationNames } from "./events.ts";
import { Table } from "../table/table.ts";
import type { ObserveOne } from "../types/events.ts";
import { expect } from "@std/expect";

describe("Events", () => {
  const getFlags = (operation: Operation) =>
    createUserEvent(operation, {
      isEmpty: true,
      isFetching: true,
      isSuccess: true,
    }).is;

  for (const name of operationNames) {
    it(`should indicate ${name} operations`, () => {
      for (const count of operationCounts) {
        const flags = getFlags([name, count]);
        const operation = IsOperation(flags);

        const capitalizedName = `${name[0].toUpperCase()}${
          name.substring(
            1,
          )
        }` as Capitalize<OperationName>;

        expect(operation[`is${capitalizedName}`]()).toEqual(true);
      }
    });
  }
});

describe("Event observer removal", () => {
  const table = Table<User>("Users", ["id", "name"]);
  const user = createUserRecord(1);

  it("should remove event observer", () => {
    const observe: ObserveOne<User> = (d) => data = d;
    table.delete.all();
    let data;
    table.observe("insert-one", observe);
    table.insert.one(user);
    expect(data).toMatchObject(user);

    data = undefined;
    table.remove.observer("insert-one", observe);
    table.delete.all();
    table.insert.one(user);
    expect(data).toBeUndefined();
  });
});
