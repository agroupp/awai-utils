/**
 * @license
 * Copyright Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

import { MongoClient, Collection, Db } from 'mongodb';
import { MongoConnectionSettings } from './mongo-connection-settings';

/**
 * @description
 * Class responsible for connection to MongoDB server.
 * Usually this is internal class used by `MongoBaseRepository`.
 *
 * Use this class if you create custom repository instead of
 * recommended way of extending `MongoBaseRepository` class.
 */
export class MongoAdapter {
  private readonly _client: MongoClient;
  private _connection: MongoClient | undefined;
  private _dbName: string;

  /**
   * Set database name
   */
  set dbName(dbName: string) {
    this._dbName = dbName;
  }

  /**
   * Get database name
   */
  get dbName(): string {
    return this._dbName;
  }

  private _db: Db;

  /**
   * MongoDB Database object
   */
  get db(): Db {
    return this._db;
  }

  private _isReady = false;

  /**
   * Return `true` if database connected
   */
  get isReady(): boolean {
    return this._isReady;
  }

  constructor(settings: MongoConnectionSettings) {
    this._client = new MongoClient(settings.connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this._dbName = settings.dbName;
  }

  /**
   * Connect to MongoDB server
   */
  async connect(): Promise<void> {
    if (this._connection) {
      return;
    }
    try {
      this._connection = await this._client.connect();
      this._db = this._connection.db(this._dbName);
      this._isReady = true;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Close the connection to server
   */
  async disconnect(): Promise<void> {
    if (!this._connection) {
      return;
    }
    try {
      await this._connection.close();
      this._connection = undefined;
      this._isReady = false;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Get the list of collections in database
   */
  async getCollections(): Promise<Collection[]> {
    if (!this._connection) {
      throw new Error('Database is not connected. Run await connect() first.');
    }
    return await this._db.collections();
  }

  /**
   * Get Collection object
   * @param name collection name
   */
  getCollection<T>(name: string): Collection<T> {
    if (!this._connection) {
      throw new Error('Database is not connected. Run await connect() first.');
    }
    return this._db.collection<T>(name);
  }
}
