import { Arr } from '../src';

const FILLED_ZERO_BASED_ARRAY: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const FILLED_FIVE_BASED_ARRAY: number[] = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

describe('Getting array elements', () => {
  it('should detect empty array', () => {
    expect(Arr.isNullOrEmpty([])).toBeTruthy();
    expect(Arr.isNullOrEmpty(undefined)).toBeTruthy();
    expect(Arr.isNullOrEmpty(null)).toBeTruthy();
    expect(Arr.isNullOrEmpty([1, 2, 3])).toBeFalsy();
  });

  it('should return first element of the array', () => {
    expect(Arr.first([1, 2, 3, 4, 5])).toEqual(1);
  });
});

describe('Creating arrays', () => {
  it('should create array filled by integers starting from 0', () => {
    expect(Arr.range(10)).toEqual(FILLED_ZERO_BASED_ARRAY);
  });

  it('should create array filled by integers starting from 5', () => {
    expect(Arr.range(10, 5)).toEqual(FILLED_FIVE_BASED_ARRAY);
  });

  it('should create a char array from string', () => {
    expect(Arr.stringToCharArray('ab cd efg')).toEqual(['a', 'b', ' ', 'c', 'd', ' ', 'e', 'f', 'g']);
    expect(Arr.stringToCharArray('')).toEqual([]);
    expect(Arr.stringToCharArray(undefined)).toEqual([]);
    expect(Arr.stringToCharArray(null)).toEqual([]);
    expect(Arr.stringToCharArray(' ')).toEqual([' ']);
  });
});
