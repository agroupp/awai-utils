/**
 * @license
 * Copyright Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

import { randomBytes } from 'crypto';

/**
 * Check if the provider called in browser
 */
const isBrowser = () =>
  window && window.crypto && window.crypto.getRandomValues && typeof window.crypto.getRandomValues === 'function';

/**
 * Check if the provider called in Nodejs
 */
const isNodejs = (): boolean => randomBytes && typeof randomBytes === 'function';

/**
 * Provides two methods that return array of random bytes.
 * Usually this class utilized by higher level `Rnd` class.
 * However, you can use it directly if you need random bytes
 * collection.
 */
export class RandomBytesProvider {
  /**
   * Return promise that resolves to array of random bytes
   * @param size Number of bytes to generate
   */
  public static nextBytesAsync(size = 1): Promise<Uint8Array> {
    let promiseFunc: (resolve: (value: Uint8Array) => void, reject: (reason: unknown) => void) => void;
    if (isBrowser()) {
      promiseFunc = (resolve, reject) => {
        try {
          const arr = new Uint8Array(size);
          window.crypto.getRandomValues(arr);
          resolve(arr);
        } catch (err) {
          reject(err);
        }
      };
    } else if (isNodejs()) {
      promiseFunc = (resolve, reject) => {
        randomBytes(size, (err, buf) => {
            if (err) {
                reject(err);
            }
            resolve(new Uint8Array(buf));
        });
      }
    } else {
      promiseFunc = (resolve, reject) => reject('No crypto provider in the system');
    }
    return new Promise(promiseFunc);
  };

  /**
   * Return array of random bytes
   * @param size Number of bytes to generate
   */
  public static nextBytes(size = 1): Uint8Array {
    if (isBrowser()) {
        const arr = new Uint8Array(size);
        return window.crypto.getRandomValues(arr);
    } else if (isNodejs()) {
      return new Uint8Array(randomBytes(size));
    } else {
      throw new Error('No crypto provider');
    }
  };
}
