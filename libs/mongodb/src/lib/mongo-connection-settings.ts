/**
 * @license
 * Performed by Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Str } from '@awai/toolbox';

const URL_PARSE_REGEX = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/gi;

/**
 * @description
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
 * @description
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
    value = value.trim();
    const parsed = new RegExp(URL_PARSE_REGEX).exec(value);
    if (!parsed || parsed.length < 10) {
      throw new Error(`Error parsing connection string provided: ${value}`);
    }
    const proto = parsed[2];
    const domain = parsed[4];
    const route = parsed[5];
    const query = parsed[7];
    this._isDnsSeedlist = proto.match(/\+srv/gi) ? true : false;
    const domainSplitted = domain.split('@');
    this._domain = domainSplitted.length === 2 ? domainSplitted[1] : domainSplitted[0];
    if (domainSplitted.length > 1) {
      const credentials = domainSplitted[0].split(':');
      this._userName = credentials[0];
      this._password = credentials[1];
    }
    this._dbName = route ? route.substring(1) : undefined;
    if (query) {
      const querySplitted = query.split('&');
      let queryParams = new Map();
      querySplitted
        .map(q => q.split('='))
        .map(q => {
          if (!Str.isNullOrWhiteSpace(q[1]) && q[1].trim().toLowerCase() === 'true') {
            return [q[0], true];
          } else if (!Str.isNullOrWhiteSpace(q[1]) && q[1].trim().toLowerCase() === 'false') {
            return [q[0], false];
          } else {
            return [q[0], q[1]];
          }
        })
        .forEach(q => (queryParams = queryParams.set(q[0], q[1])));
      if (queryParams.get('retryWrites')) {
        this._isRetryWrites = queryParams.get('retryWrites');
      }
      if (queryParams.get('w')) {
        this._writeConcern = queryParams.get('w');
      }
    }
  }
}
