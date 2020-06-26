/**
 * @license
 * Performed by Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ObjectId } from 'mongodb';

/**
 * @description
 * Extend this interface when you create your
 * storage objects
 *
 * @example
 * ```typescript
 * interface TestStorageObject extends MongoStorageObject {
 *   a: number;
 * }
 * ```
 */
export interface MongoStorageObject {
  _id: ObjectId;
  created: number;
}
