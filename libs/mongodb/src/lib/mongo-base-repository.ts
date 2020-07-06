/**
 * @license
 * Copyright Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Collection, ObjectId, OptionalId, FilterQuery, UpdateQuery } from 'mongodb';
import { MongoAdapter } from './mongo-adapter';
import { MongoConnectionSettings } from './mongo-connection-settings';
import { MongoStorageObject } from './mongo-storage-object';
import { Arr } from '@awai/toolbox';

/**
 * Abstract class representing repository. Extend this class in your project
 * to create your own repository for specified MongoDB collection.
 *
 * Basic repository implements four CRUD methods. You can create your own
 * methods in extended class according to your business logic.
 *
 * @example
 * ```typescript
 * class TestRepository extends MongoBaseRepository<TestStorageObject> {
 *  constructor(settings: MongoConnectionSettings) {
 *    super(settings);
 *  }
 *
 *  async getByA(value: number): Promise<TestStorageObject> {
 *    const collection = await this.usingAdapter();
 *    return await collection.findOne({a : value});
 *  }
 * }
 * ```
 *
 */
export abstract class MongoBaseRepository<StorageObject extends MongoStorageObject> {
  protected readonly adapter: MongoAdapter;
  protected readonly collectionName: string;

  constructor(settings: MongoConnectionSettings) {
    this.adapter = new MongoAdapter(settings);
    this.collectionName = settings.collectionName;
  }

  /**
   * Creates new document in MongoDb with the
   * object provided
   * @param obj
   */
  public async create(obj: StorageObject): Promise<StorageObject> {
    obj._id = new ObjectId();
    obj.created = Date.now();
    const collection = await this.usingAdapter();
    const result = await collection.insertOne(obj as OptionalId<StorageObject>);
    if (!result || result.insertedCount !== 1) {
      throw new Error('Error inserting document');
    }
    obj._id = result.insertedId;
    return obj;
  }

  /**
   * Reads MongoDb document by its ID
   * @param id
   */
  public async read(id: string): Promise<StorageObject> {
    const query = { _id: new ObjectId(id) } as FilterQuery<StorageObject>;
    const collection = await this.usingAdapter();
    const result = Arr.first(await collection.find(query).toArray());
    return result;
  }

  /**
   * Updates MongoDb document
   * @param obj
   */
  async update(obj: StorageObject): Promise<void> {
    const filterQuery = { _id: obj._id } as FilterQuery<StorageObject>;
    const updateQuery = { $set: obj } as UpdateQuery<StorageObject>;
    const collection = await this.usingAdapter();
    const result = await collection.updateOne(filterQuery, updateQuery);
    if (result.matchedCount !== 1 || result.modifiedCount !== 1) {
      throw new Error('Error updating document');
    }
  }

  /**
   * Deletes MongoDb document by ID
   * @param id
   */
  async delete(id: string): Promise<void> {
    const filterQuery = { _id: new ObjectId(id) } as FilterQuery<StorageObject>;
    const collection = await this.usingAdapter();
    const result = await collection.deleteOne(filterQuery);
    if (!result || result.deletedCount !== 1) {
      throw new Error('Error deleting document');
    }
  }

  /**
   * Makes sure that database is connected and returns collection object.
   * Use this method in your custom data manipulation methods.
   *
   * @example
   * ```typescript
   *  async getByA(value: number): Promise<TestStorageObject> {
   *    const collection = await this.usingAdapter();
   *    return await collection.findOne({a : value});
   *  }
   * ```
   *
   */
  protected async usingAdapter(): Promise<Collection<StorageObject>> {
    try {
      await this.adapter.connect();
      return this.adapter.getCollection<StorageObject>(this.collectionName);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Disconnects from MongoDb server. Use it
   * in your test environment.
   *
   * @example
   * ```typescript
   * afterEach(async () => await repository.endUsingAdapter());
   * ```
   */
  async endUsingAdapter(): Promise<void> {
    await this.adapter.disconnect();
  }
}
