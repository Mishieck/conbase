import { describe, it } from "@std/testing";
import {
  convertArrayToRecord,
  convertRecordToArray,
} from "./record-converter.ts";
import type { Fields } from "../types/database.ts";
import { expect } from "@std/expect";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
};

const userRecord: User = {
  id: "1",
  firstName: "First",
  lastName: "Last",
  age: 23,
};

const userFields: Fields<User> = {
  id: 0,
  firstName: 1,
  lastName: 2,
  age: 3,
};

const userArray: Array<User[keyof User]> = [
  userRecord.id,
  userRecord.firstName,
  userRecord.lastName,
  userRecord.age,
];

describe("convertRecordToArray", () => {
  const record: User = { ...userRecord };
  const fields = { ...userFields };
  const expectedArray = [...userArray];
  const convert = convertRecordToArray(fields);

  it("should convert record to an array", () => {
    const array = convert(record) as typeof expectedArray;
    expect(array).toEqual(expectedArray);
  });

  it("should replace missing values with null", () => {
    const incompleteRecord = { ...record } as
      & Pick<User, "id">
      & Partial<typeof record>;

    const missingKey: keyof typeof record = "lastName";
    delete incompleteRecord[missingKey];

    const incompleteArray = expectedArray.map((value) =>
      value === record[missingKey] ? null : value
    );

    const array = convert(incompleteRecord) as typeof incompleteArray;
    expect(array).toEqual(incompleteArray);
  });
});

describe("convertArrayToRecord", () => {
  const convert = convertArrayToRecord<User>(userFields);

  it("should convert array to record", () => {
    const array = [...userArray];
    const expectedRecord: User = { ...userRecord };
    const record = convert(array);
    expect(record).toEqual(expectedRecord);
  });
});
