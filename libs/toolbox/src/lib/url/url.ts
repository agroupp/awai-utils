/**
 * @license
 * Copyright Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Str } from '../str';
import { Arr } from '../arr';

/**
 * URI reference parsing regular expression
 * From RFC 3986 https://tools.ietf.org/html/rfc3986#appendix-B
 */
const URI_PARSE_REGEX = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;

/**
 * Check if value includes URI scheme (like http:, https:)
 */
const URI_SCHEME_VALIDATOR = /^([^:/?#]+):/;

/**
 * The `Url` class is used to parse or create from 0 the `URL`. It gives
 * you different property accessors that allow you easily access or
 * set parts of the `URL`.
 * Create the `Url` instance with the uri string or empty to construct it from zero.
 *
 * @example
 *
 * const url = new Url('https://tools.ietf.org/html/rfc3986#appendix-B');
 *
 *
 */
export class Url {

  /**
   * IANA-registered scheme
   */
  private _scheme: string;

  /**
   * IANA-registered scheme or protocol
   */
  get protocol(): string { return this._scheme; }

  /**
   * IANA-registered scheme or protocol
   */
  set protocol(value: string) {
    // TODO: Check for correct sheme https://en.wikipedia.org/wiki/List_of_URI_schemes
    this._scheme = value;
  }

  /**
   * Authority or name of domain
   */
  private _domainName: string;

  /**
   * Name of the domain or IP address
   */
  get domain(): string { return this._domainName; }

  /**
   * Name of the domain or IP address
   */
  set domain(value: string) {
    if (!Str.isDomainName(value) && !Str.isIp(value)) {
      throw new Error('Not valid domain name');
    }
    this._domainName = value;
  }

  /**
   * IP port number
   */
  private _port: number;

  /**
   * IP port number
   */
  get port(): number { return this._port; }

  /**
   * IP port number
   */
  set port(value: number) {
    this._port = value;
  }

  /**
   * Username for HTTP Authentication
   */
  private _username: string;

  /**
   * Username for HTTP Authentication
   */
  get username(): string { return this._username; }

  /**
   * Username for HTTP Authentication
   */
  set username(value: string) {
    this._username = value;
  }

  /**
   * Password for HTTP Authentication
   */
  private _password: string;

  /**
   * Password for HTTP Authentication
   */
  get password(): string { return this._password; }

  /**
   * Password for HTTP Authentication
   */
  set password(value: string) {
    this._password = value;
  }

  /**
   * Route path in form `/route/path`
   */
  private _path: string;

  /**
   * Route path in form `/route/path`
   */
  get pathString(): string { return this._path; }

  /**
   * Route path as array of its parts
   */
  get pathParams(): string[] { return Arr.removeEmptyStrings(this._path.split('/')); }

  /**
   * Route path in form `/route/path`
   */
  set path(value: string) {
    this._path = value;
  }

  /**
   * Query string
   */
  private _query: string;

  /**
   * Map of query params as a key - value. Values are
   * parsed as strings, numbers and booleans
   */
  get queryParams(): Map<string, string | number | boolean> {
    if (Str.isNullOrWhiteSpace(this._query)) {
      return new Map();
    }
    const q = this._query.replace('?', Str.empty);
    const querySplitted = Arr.removeEmptyStrings(q.split('&'));
    if (!querySplitted || querySplitted.length === 0) {
      return new Map();
    }
    let result = new Map<string, string | number | boolean>();
    for (let i = 0; i < querySplitted.length; i++) {
      const item = querySplitted[i].split('=');
      result = result.set(item[0].trim(), item.length > 1 ? Str.parseNumBool(item[1]) : Str.empty);
    }
    return result;
  }

  /**
   * Map of query params as a key - value
   *
   * @example
   * url.queryParams = new Map().set('retryWrites', true).set('w', 'majority');
   */
  set queryParams(value: Map<string, string | number | boolean>) {
    if (!value || value.size === 0) {
      return;
    }
    this._query = Str.empty;
    value.forEach((v, k) => this._query += `&${k}=${v}`);
    this._query = this._query.substring(1);
  }

  /**
   * Hash fragment
   */
  private _hash: string;

  /**
   * Hash fragment
   */
  get hashFragment(): string { return this._hash; }

  /**
   * Hash fragment
   */
  set hashFragment(value: string) {
    this._hash = value;
  }

  /**
   * Return `true` if SSL is used
   */
  get isSsl(): boolean { return this._scheme === 'https'}

  /**
   * Create the `Url` instance with the uri string or empty to construct it from zero.
   *
   * @example
   * const url = new Url('https://tools.ietf.org/html/rfc3986#appendix-B');
   *
   * @param url standard `uri` string
   */
  constructor(url?: string) {
    if (Str.isNullOrWhiteSpace(url)) {
      return;
    }
    url = url.trim();
    url = url.startsWith('//') ? `http:${url}` : url;
    const shemeValidator = new RegExp(URI_SCHEME_VALIDATOR, 'gi');
    url = shemeValidator.test(url) ? url : `http://${url}`;
    const uriParseRegex = new RegExp(URI_PARSE_REGEX, 'gi');
    const parsed = uriParseRegex.exec(url);
    if (!parsed || Str.isNullOrWhiteSpace(parsed[4])) {
      throw new Error('Not valid URL provided');
    }
    this._scheme = Str.isNullOrWhiteSpace(parsed[1]) ? 'http' : parsed[2];
    this.splitDomainAndAuth(parsed[4]);
    this._path = parsed[5];
    this._query = parsed[7];
    this._hash = parsed[9];
  }

  /**
   * Return `true` if provided value can be parsed as valid URI
   * @param value URI to test
   */
  public static isUrl(value: string): boolean {
    const uriParseRegex = new RegExp(URI_PARSE_REGEX, 'gi');
    const parsed = uriParseRegex.exec(value);
    return parsed && !!parsed[4];
  }

  /**
   * Return string representation of the whole URL
   */
  public toString(): string {
    let url = `${this._scheme}://`;
    if (!Str.isNullOrWhiteSpace(this._username)) {
      url += `${this._username}:${this._password}@`;
    }
    url += this._domainName;
    if (this._port) {
      url += `:${this._port}`;
    }
    if (!Str.isNullOrWhiteSpace(this._path)) {
      url += this._path.charAt(0) !== '/' ? `/${this._path}` : this._path;
    }
    if (!Str.isNullOrWhiteSpace(this._query)) {
      url += `?${this._query}`;
    }
    if (!Str.isNullOrWhiteSpace(this._hash)) {
      url += `#${this._hash}`;
    }
    return url;
  }

  /**
   * Return `URL` object
   * @see https://developer.mozilla.org/en-US/docs/Web/API/URL
   */
  public toURL(): URL {
    return new URL(this.toString());
  }

  /**
   * Parse authority value to retrieve domain, port
   * username and password
   * @param value authority value
   */
  private splitDomainAndAuth(value: string) {
    const valueSplitted = value.split('@');
    const domain = valueSplitted.length === 2 ? valueSplitted[1] : valueSplitted[0];
    if (valueSplitted.length > 1) {
      const credentials = valueSplitted[0].split(':');
      this._username = credentials[0];
      this._password = credentials[1];
    }
    const domainSplitted = domain.split(':');
    this.domain = domainSplitted[0];
    if (domainSplitted.length > 1 && !isNaN(+domainSplitted[1])) {
      this._port = +domainSplitted[1];
    }
  }
}
