/**
 * @license
 * Copyright Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Str } from '../str';

/**
 * Provides a set of helper methods for arrays.
 */
export class Arr {
  /**
   * Return `true` if a specified array is null or empty
   * @param arr
   */
  public static isNullOrEmpty(arr: Array<unknown>): boolean {
    return arr === undefined || arr === null || arr.length === 0
  }

  /**
   * Return the first element of a specified array
   * @param array
   */
  public static first<T>(arr: Array<T>): T | null {
    return Arr.isNullOrEmpty(arr) ? null : arr[0];
  }

  /**
   * Return the last element of a specified array
   * @param array
   */
  public static last<T>(arr: Array<T>): T | null {
    return Arr.isNullOrEmpty(arr) ? null : arr[arr.length - 1];
  }

  /**
   * Return array filled by range of integers
   * @param size
   */
  public static range(size: number, start = 0): Array<number> {
    const result = [];
    for(let i = start; i < size + start; i++) {
      result[i - start] = i;
    }
    return result;
  }

  /**
   * Convert string into array of chars
   * @param str
   */
  public static stringToCharArray(str: string): Array<string> {
    if (Str.isNullOrEmpty(str)) {
      return [];
    }
    let result: string[] = str.split('');
    result = result.filter(c => c !== null && c !== undefined && c.length > 0);
    return result;
  }

  /**
   * Convert array of bytes into array of floats within range [0.0, 1.0]
   * @param bytes
   */
  public static bytesToFloat(bytes: Uint8Array): Array<number> {
    const result = [];
    for(let i = 0; i < bytes.length; i++) {
      result[i] = bytes[i] / 256;
    }
    return result;
  }
}
