/**
 * @license
 * Copyright Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

import { RandomBytesProvider } from './provider';
import { Arr } from '../arr';

/**
 * Provides a set of helper methods to generate cryptographically
 * strong random values.
 */
export class Rnd {
  /**
   * Return a random floating-point number or array of
   * random floating-point numbers that is greater
   * than or equal to 0.0, and less than 1.0
   * @param qty number of results to return
   */
  public static nextFloat(qty = 1): number | number[] {
    const bytes = RandomBytesProvider.nextBytes(qty);
    return qty === 1 ? bytes[0] / 256 : Arr.bytesToFloat(bytes);
  }

  /**
   * Return a promise that resolves to random floating-point
   * number or array of random floating-point
   * numbers that is greater than or equal to 0.0, and less
   * than 1.0
   * @param qty number of results to return
   */
  public static async nextFloatAsync(qty = 1): Promise<number | number[]> {
    const bytes = await RandomBytesProvider.nextBytesAsync(qty);
    return qty === 1 ? bytes[0] / 256 : Arr.bytesToFloat(bytes);
  }

  /**
   * Return a random integer or array of random integers
   * that is within a specified range
   * @param min lower bound of the random number returned
   * @param max upper bound of the random number returned. `max` must be greater than or equal to `min`
   * @param qty number of results to return
   *
   * With no parameters it generates one integer within the range [0, 10]
   */
  public static nextInt(min = 0, max = 10, qty = 1): number | number[] {
    let floatValue = Rnd.nextFloat(qty);
    if (qty === 1) {
      return Math.round(floatValue as number * (max - min) + min);
    } else {
      floatValue = floatValue as number[];
      const result = [];
      for (let i = 0; i < floatValue.length; i++) {
        result[i] = Math.round(floatValue[i] * (max - min) + min);
      }
      return result;
    }
  }

  /**
   * Return a promise that resolves to random integer
   * or array of random integers that is
   * within a specified range
   * @param min lower bound of the random number returned
   * @param max upper bound of the random number returned. `max` must be greater than or equal to `min`
   * @param qty number of results to return
   *
   * With no parameters it generates one integer within the range [0, 10]
   */
  public static async nextIntAsync(min = 0, max = 10, qty = 1): Promise<number | number[]> {
    let floatValue = await Rnd.nextFloatAsync(qty);
    if (qty === 1) {
      return Math.round(floatValue as number * (max - min) + min);
    } else {
      floatValue = floatValue as number[];
      const result = [];
      for (let i = 0; i < floatValue.length; i++) {
        result[i] = Math.round(floatValue[i] * (max - min) + min);
      }
      return result;
    }
  }
}
