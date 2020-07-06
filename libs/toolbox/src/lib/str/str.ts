/**
 * @license
 * Copyright Arthur Groupp
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Arr } from '../arr';
import { Rnd } from '../random';

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

/**
 * Regex to check for valid domain name
 */
const DOMAIN_NAME_REGEXP = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

/**
 * List of boundaries that mean "new line"
 */
const NEW_LINE_BOUNDARIES: string[] = ['\r\n', '\r', '\n'];

/**
 * Regex to check if string is a number
 */
const DIGITS_ONLY_REGEX = /^[0-9]+$/;

/**
 * Regex to check if string is a number
 */
const ALPHA_ONLY_REGEX = /^[A-z]+$/;

/**
 * Set of English alphbet as a string
 */
export const ENGLISH_LETTERS_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Provides a set of helper methods for text processing.
 */
export class Str {
  /**
   * Empty string
   */
  public static get empty(): string { return ''; }

  /**
   * Ordered set of lowercase English letters
   */
  public static get englishLettersOrdered(): string { return ENGLISH_LETTERS_LOWERCASE; }

  /**
   * Return `true` if a specified string is null, empty
   */
  public static isNullOrEmpty(str: string): boolean {
    return str === undefined || str === null || str.length === 0;
  }

  /**
   * Return `true` if a specified string is null, empty, or consists only of white-space characters
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
   * Return `true` if all characters in the string are lowercase
   * @param str
   */
  public static isLower(str: string): boolean {
    return !Str.isNullOrWhiteSpace(str) && str === str.toLowerCase();
  }

  /**
   * Return `true` if char is ASCII control symbol
   * @param char one char string. All other characters will be ignored
   */
  public static isControl(char: string): boolean {
    if (Str.isNullOrEmpty(char)) {
      return false;
    }
    return char.charCodeAt(0) < 32;
  }

  /**
   * Return `true` if all characters in the string are digits only
   * @param str
   */
  public static isNumber(str: string): boolean {
    return DIGITS_ONLY_REGEX.test(str);
  }

  /**
   * Return `true` if all characters in the string are alpha only
   * @param str
   */
  public static isAlpha(str: string): boolean {
    return ALPHA_ONLY_REGEX.test(str);
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
    return !Str.isNullOrWhiteSpace(str) && (!!str.match(/localhost/gi) || DOMAIN_NAME_REGEXP.test(str));
  }

  /**
   * Return a copy of the string with its first character capitalized and the rest lowercased
   *
   * @param str
   */
  public static capitalize(str: string): string {
    return Str.isNullOrWhiteSpace(str) ? Str.empty : str.charAt(0).toUpperCase().concat(str.slice(1));
  }

  /**
   * Return a copy of the string with uppercase characters converted to lowercase and vice versa
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
   * Return an array of the lines in the string, breaking at line boundaries
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

  /**
   * Return source text with "term" wrapped by specified HTML tag
   *
   *
   * @example
   *
   * const text = 'who also wrote the majority opinion in the Texas Case, wrote the majority opinion here';
   * const result = Str.wrapInHtmlTag(text, 'majority', 'em', ['bold', 'italic']);
   *
   *
   * The result will be:
   *
   * "who also wrote the <em class="bold italic">majority</em> opinion in the Texas Case, wrote the <em class="bold italic">majority</em> opinion here"
   *
   * @param str source text
   * @param term text that must be wrapped
   * @param tagName name of HTML tag
   * @param tagClasses (optional) list of css classes of HTML tag
   *
   */
  public static wrapInHtmlTag(str: string, term: string, tagName: string, tagClasses: string[] = null): string {
    const termRegex = new RegExp(term, 'ig');
    const matches = str.matchAll(termRegex);
    let tag = `<${tagName}`;
    if (!Arr.isNullOrEmpty(tagClasses)) {
      tag += ` class="`;
      for(let i = 0; i < tagClasses.length; i++) {
        tag += `${tagClasses[i]}`;
        tag += i < tagClasses.length - 1 ? ' ' : Str.empty;
      }
      tag += `"`;
    }
    tag += `>`;
    const tagLength = tag.length + 3 + tagName.length;
    let output = '';
    for(const match of matches) {
        output = output ? output.substr(0, match.index + tagLength) : match.input.substr(0, match.index);
        output += `${tag}${match[0]}</${tagName}>`;
        output += match.input.substr(match.index + match[0].length);
    }
    return output || str;
  }

  /**
   * Generate alpha numeric random sequence string
   * @param size length of generated string
   * @param alphaLower include lowercase characters
   * @param alphaUpper include upercase characters
   * @param decimal include digits
   */
  public static random(size = 8, alphaLower = true, alphaUpper = true, decimal = true): string {
    let chars: string[] = [];
    chars = alphaLower ? chars.concat(Arr.englishLettersOrdered) : chars;
    chars = alphaUpper ? chars.concat(Arr.englishLettersUppercaseOrdered) : chars;
    chars = decimal ? chars.concat(Arr.range(10, 0).map(d => d.toString())) : chars;
    if (Arr.isNullOrEmpty(chars)) {
      return Str.empty;
    }
    chars = Arr.shuffle(chars);
    const result: string[] = [];
    for(let i = 0; i < size; i++) {
      result[i] = chars[Rnd.next(0, chars.length - 1)];
    }
    return result.join('');
  }

  /**
   * Try to find number or boolean value in a provided string
   * and return converted value
   * @param str string to parse
   */
  public static parseNumBool(str: string): string | number | boolean {
    if (Str.isNullOrWhiteSpace(str)) {
      return str;
    }
    str = str.trim();
    let result: string | number | boolean;
    if (str.toLowerCase() === 'true') {
      result = true;
    } else if (str.toLowerCase() === 'false') {
      result = false;
    } else if (Str.isNumber(str) && !isNaN(+str)) {
      result = +str;
    } else {
      result = str;
    }
    return result;
  }
}
