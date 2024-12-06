import { describe, it } from "@std/testing";
import { DatabaseError, type DatabaseErrorCause } from "./error.ts";
import { expect } from "@std/expect";

describe("DatabaseError", () => {
  it("should create error", () => {
    const cause: DatabaseErrorCause = "EXISTS";
    const message = "Record already exists";
    const error = new DatabaseError(cause, message);

    expect(error.cause).toBe(cause);
    expect(error.message).toBe(message);
    expect(error).toBeInstanceOf(Error);
  });
});
