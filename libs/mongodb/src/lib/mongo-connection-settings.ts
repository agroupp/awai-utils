/**
 * @license
 * Copyright Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Str, Url } from '@awai/toolbox';

/**
 * Class representing MongoDB server connection settings. Use
 * `MongoConnectionSettingsBuilder` to create an instance of this class.
 *
 * Use connection settings to initialize repository class
 *
 * @example
 * ```typescript
 * const repository = new TestRepository(connSettings)
 * ```
 *
 * @see `MongoConnectionSettingsBuilder`
 */
export class MongoConnectionSettings {
  private readonly _userName: string;
  private readonly _password: string;
  private readonly _domain: string;
  private readonly _dbName: string;

  /**
   * Get database name
   */
  get dbName(): string {
    return this._dbName;
  }

  private _isDnsSeedlist: boolean;

  /**
   * Set DNS speed list parameter
   */
  set isDnsSeedlist(value: boolean) {
    this._isDnsSeedlist = value;
  }

  private _writeConcern: string | number;

  /**
   * Set write concern parameter
   */
  set writeConcern(value: string | number) {
    this._writeConcern = value;
  }

  private _isRetryWrites: boolean;

  /**
   * Set retry writes parameter
   */
  set isRetryWrites(value: boolean) {
    this._isRetryWrites = value;
  }

  private readonly _collectionName: string;

  /**
   * Get the name of the collection
   */
  get collectionName(): string {
    return this._collectionName;
  }

  /**
   * Get MongoDB connection string
   */
  get connectionString(): string {
    let str = `mongodb`;
    str += this._isDnsSeedlist ? '+srv' : Str.empty;
    str += '://';
    str += this._userName && this._password ? `${this._userName}:${this._password}@` : Str.empty;
    str += this._domain;
    str += this._dbName ? `/${this._dbName}` : Str.empty;
    str += `?retryWrites=${this._isRetryWrites}&w=${this._writeConcern}`;
    return str;
  }

  constructor(
    userName: string,
    password: string,
    domain: string,
    dbName = 'test',
    isDnsSeedlist = false,
    writeConcern: string | number = 'majority',
    isRetryWrites = true,
    collectionName?: string
  ) {
    this._userName = userName;
    this._password = password;
    this._domain = domain;
    this._dbName = dbName;
    this._isDnsSeedlist = isDnsSeedlist;
    this._writeConcern = writeConcern;
    this._isRetryWrites = isRetryWrites;
    this._collectionName = collectionName;
  }

  toString(): string {
    return this.connectionString;
  }
}

/**
 * Initializes the new instance of `MongoConnectionSettings` class
 *
 * @example
 * ```typescript
 * const connSettingsBuilder = new MongoConnectionSettingsBuilder(connectionString);
 * connSettingsBuilder.collectionName = 'testColl1';
 * connSettings = connSettingsBuilder.toSettings();
 * ```
 *
 * Use connSettings to initialize repository class
 *
 * @example
 * ```typescript
 * const repository = new TestRepository(connSettings)
 * ```
 */
export class MongoConnectionSettingsBuilder {
  private _userName: string;

  /**
   * Get user name
   */
  get userName(): string {
    return this._userName;
  }

  /**
   * Set user name
   */
  set userName(value: string) {
    this._userName = value;
  }

  private _password: string;

  /**
   * Return `true` if password set
   */
  get isPasswordSet(): boolean {
    return Str.isNullOrWhiteSpace(this._password) ? false : true;
  }

  /**
   * Set password
   */
  set password(value: string) {
    this._password = value;
  }

  private _domain: string;

  /**
   * Get domain name
   */
  get domain(): string {
    return this._domain;
  }

  /**
   * Set domain name
   */
  set domain(value: string) {
    this._domain = value;
  }

  private _dbName: string;

  /**
   * Get database name
   */
  get dbName(): string {
    return this._dbName;
  }

  /**
   * Set database name
   */
  set dbName(value: string) {
    this._dbName = value;
  }

  private _isDnsSeedlist: boolean;

  /**
   * Get DNS speed list parameter
   */
  get isDnsSeedlist(): boolean {
    return this._isDnsSeedlist;
  }

  /**
   * Set DNS speed list parameter
   */
  set isDnsSeedlist(value: boolean) {
    this._isDnsSeedlist = value;
  }

  private _writeConcern: string | number;

  /**
   * Get write concern parameter
   */
  get writeConcern(): string | number {
    return this._writeConcern;
  }

  /**
   * Set write concern parameter
   */
  set writeConcern(value: string | number) {
    this._writeConcern = value;
  }

  private _isRetryWrites: boolean;

  /**
   * Get retry writes parameter
   */
  get isRetryWrites(): boolean {
    return this._isRetryWrites;
  }

  /**
   * Set retry writes parameter
   */
  set isRetryWrites(value: boolean) {
    this._isRetryWrites = value;
  }

  private _collectionName: string;

  /**
   * Get the name of the collection
   */
  get collectionName(): string {
    return this._collectionName;
  }

  /**
   * Set the name of the collection
   */
  set collectionName(value: string) {
    this._collectionName = value;
  }

  constructor(connectionString?: string) {
    if (!Str.isNullOrWhiteSpace(connectionString)) {
      this.parseConnectionString(connectionString);
    }
  }

  /**
   * Return `MongoConnectionSettings` instance
   * with all parameters set.
   */
  toSettings(): MongoConnectionSettings {
    return new MongoConnectionSettings(
      this._userName,
      this._password,
      this._domain,
      this._dbName,
      this._isDnsSeedlist,
      this._writeConcern,
      this._isRetryWrites,
      this._collectionName
    );
  }

  /**
   * Parse connection string and retrieve all the params
   * @param value
   */
  private parseConnectionString(value: string) {
    const url = new Url(value);
    this._isDnsSeedlist = url.protocol.match(/\+srv/gi) ? true : false;
    this._domain = url.domain;
    if (url.port) {
      this._domain += `:${url.port}`;
    }
    if (url.username && url.password) {
      this._userName = url.username;
      this._password = url.password;
    }
    this._dbName = url.pathParams && url.pathParams.length > 0 ? url.pathParams[0] : undefined;
    if (url.queryParams.get('retryWrites')) {
      this._isRetryWrites = url.queryParams.get('retryWrites') as boolean;
    }
    if (url.queryParams.get('w')) {
      this._writeConcern = url.queryParams.get('w') as string | number;
    }
  }
}
