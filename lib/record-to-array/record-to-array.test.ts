import { describe, it, expect } from 'bun:test';
import { convertRecordToArray } from './record-to-array';
import { createFields } from '../fields/fields';

describe('convertRecordToArray', () => {
  const record = {
    id: '1',
    firstName: 'First',
    lastName: 'Last',
    age: 23
  };

  const fields = createFields(record);

  const expectedArray = [
    record.id,
    record.firstName,
    record.lastName,
    record.age
  ];

  const convert = convertRecordToArray(fields);

  it('should convert record to an array', () => {
    const array = convert(record) as typeof expectedArray;
    expect(array).toEqual(expectedArray);
  });

  it('should replace missing values with null', () => {
    const incompleteRecord = { ...record } as Pick<typeof record, 'id'> &
      Partial<typeof record>;

    const missingKey: keyof typeof record = 'lastName';
    delete incompleteRecord[missingKey];

    const incompleteArray = expectedArray.map(value =>
      value === record[missingKey] ? null : value
    );

    const array = convert(incompleteRecord) as typeof incompleteArray;
    expect(array).toEqual(incompleteArray);
  });
});
