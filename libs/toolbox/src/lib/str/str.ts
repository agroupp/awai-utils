/**
 * @license
 * Copyright Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * A regular expression that matches valid e-mail addresses.
 *
 * This regexp was taken from
 * [Angular source code](https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts)
 *
 */
const EMAIL_REGEXP =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Accurate regex to check for an IP address
 *
 * [Source](https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html)
 */
const IP_REGEXP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const DOMAIN_NAME_REGEXP = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

const NEW_LINE_BOUNDARIES: string[] = ['\r\n', '\r', '\n'];

/**
 * Set of English alphbet as a string
 */
export const ENGLISH_LETTERS_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';

/**
 * @description
 * Provides a set of helper methods for text processing.
 */
export class Str {
  /**
   * Empty string
   */
  public static get empty(): string { return ''; }

  /**
   * @description
   * Ordered set of lowercase English letters
   */
  public static get englishLettersOrdered(): string { return ENGLISH_LETTERS_LOWERCASE; }

  /**
   * Return `true` if a specified string is null, empty, or consists only of white-space characters.
   */
  public static isNullOrEmpty(str: string): boolean {
    return str === undefined || str === null || str.length === 0;
  }

  /**
   * Return `true` if a specified string is null, empty, or consists only of white-space characters.
   */
  public static isNullOrWhiteSpace(str: string): boolean {
    return str === undefined || str === null ||
      str.length === 0 || str.trim().length === 0;
  }

  /**
   * Return `true` if all characters in the string are uppercase
   * @param str
   */
  public static isUpper(str: string): boolean {
    return !Str.isNullOrWhiteSpace(str) && str === str.toUpperCase();
  }

  /**
   * Return `true` if all characters in the string are uppercase
   * @param str
   */
  public static isLower(str: string): boolean {
    return !Str.isNullOrWhiteSpace(str) && str === str.toLowerCase();
  }

  /**
   * Return `true` if string is a valid email address
   * @param str
   */
  public static isEmail(str: string): boolean {
    if (Str.isNullOrWhiteSpace(str)) {
      return false;
    }
    str = str.trim().toLowerCase();
    const splitted = str.split('@');
    if (splitted.length !== 2) {
      return false;
    }
    if (splitted[0].charAt(0) === '"' && splitted[0].charAt(splitted[0].length - 1) === '"') {
      splitted[0] = splitted[0].slice(1, splitted[0].length - 2);
    }
    return EMAIL_REGEXP.test(splitted.join('@'));
  }

  /**
   * Return `true` if string is a valid IP address
   * @param str
   */
  public static isIp(str: string): boolean {
    return !Str.isNullOrWhiteSpace(str) && IP_REGEXP.test(str);
  }

  /**
   * Return `true` if string looks like a valid domain name
   * @param str
   */
  public static isDomainName(str: string): boolean {
    return !Str.isNullOrWhiteSpace(str) && DOMAIN_NAME_REGEXP.test(str);
  }

  /**
   * Return a copy of the string with its first character capitalized and the rest lowercased.
   *
   * @param str
   */
  public static capitalize(str: string): string {
    return Str.isNullOrWhiteSpace(str) ? Str.empty : str.charAt(0).toUpperCase().concat(str.slice(1));
  }

  /**
   * Return a copy of the string with uppercase characters converted to lowercase and vice versa.
   * @param str
   */
  public static swapCase(str: string): string {
    if (Str.isNullOrWhiteSpace(str)) {
      return Str.empty;
    }
    let result = Str.empty;
    for(let i = 0; i < str.length; i++) {
      result += Str.isUpper(str[i]) ? str[i].toLowerCase() : str[i].toUpperCase();
    }
    return result;
  }

  /**
   * Return an array of the lines in the string, breaking at line boundaries.
   * @param str
   */
  public static splitLines(str: string): string[] {
    NEW_LINE_BOUNDARIES.forEach(nl => str = str.replace(nl, '\n'));
    const result = str.split('\n');
    if (Str.isNullOrWhiteSpace(result[result.length - 1])) {
      result.splice(result.length - 1, 1);
    }
    return result;
  }
}
