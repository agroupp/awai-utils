import { Str } from '../src';

describe('String manipulations', () => {
  it('should detect empty string', () => {
    expect(Str.isNullOrEmpty('')).toBeTruthy();
    expect(Str.isNullOrEmpty(Str.empty)).toBeTruthy();
    expect(Str.isNullOrEmpty(' ')).toBeFalsy();
    expect(Str.isNullOrEmpty(null)).toBeTruthy();
    expect(Str.isNullOrEmpty(undefined)).toBeTruthy();
    expect(Str.isNullOrEmpty('  a ')).toBeFalsy();
  });

  it('should detect empty or white space string', () => {
    expect(Str.isNullOrWhiteSpace('')).toBeTruthy();
    expect(Str.isNullOrWhiteSpace(Str.empty)).toBeTruthy();
    expect(Str.isNullOrWhiteSpace(' ')).toBeTruthy();
    expect(Str.isNullOrWhiteSpace('          ')).toBeTruthy();
    expect(Str.isNullOrWhiteSpace(null)).toBeTruthy();
    expect(Str.isNullOrWhiteSpace(undefined)).toBeTruthy();
    expect(Str.isNullOrWhiteSpace('  a ')).toBeFalsy();
  });

  it('should return empty string', () => expect(Str.isNullOrWhiteSpace(Str.empty)).toBeTruthy());

  it('should return Ordered set of lowercase English letters', () => {
    expect(Str.englishLettersOrdered).toEqual('abcdefghijklmnopqrstuvwxyz');
  });

  it('should capitalize first character in string', () => {
    expect(Str.capitalize('abc')).toEqual('Abc');
    expect(Str.capitalize(undefined)).toEqual(Str.empty);
  });

  it('should check if all characters are in uppercase', () => {
    expect(Str.isUpper('AB C')).toBeTruthy();
    expect(Str.isUpper('AB dC')).toBeFalsy();
  });

  it('should check if all characters are in lowercase', () => {
    expect(Str.isLower('ab c')).toBeTruthy();
    expect(Str.isLower('AB dC')).toBeFalsy();
  });

  it('should swap upper and lower case characters', () => {
    expect(Str.swapCase('AbCdEf')).toEqual('aBcDeF');
    expect(Str.swapCase(undefined)).toEqual(Str.empty);
  });

  it('should split the lines', () => {
    expect(Str.splitLines('ab c\n\nde fg\rkl\r\n')).toEqual(['ab c', '', 'de fg', 'kl']);
    expect(Str.splitLines(Str.empty)).toEqual([]);
    expect(Str.splitLines('one line')).toEqual(['one line']);
    expect(Str.splitLines('one line\n')).toEqual(['one line']);
  });

  it('should validate email address', () => {
    expect(Str.isEmail(Str.empty)).toBeFalsy();
    expect(Str.isEmail('abc@domain')).toBeTruthy();
    expect(Str.isEmail('abc@domain.com')).toBeTruthy();
    expect(Str.isEmail('abc@domain.net')).toBeTruthy();
    expect(Str.isEmail('abc@domain@domain2')).toBeFalsy();

    // Quoted
    expect(Str.isEmail('"abc"@domain.com')).toBeTruthy();
    expect(Str.isEmail('"ab"dc"@domain.com')).toBeFalsy();
    expect(Str.isEmail('"ab"dc@domain.com')).toBeFalsy();
    expect(Str.isEmail('em"ail"@domain.com')).toBeFalsy();

    // IP
    expect(Str.isEmail('abc@172.16.12.3')).toBeTruthy();

    // Dots
    expect(Str.isEmail('.email@domain.com')).toBeFalsy();
    expect(Str.isEmail('email.@domain.com')).toBeFalsy();
    expect(Str.isEmail('ema..il@domain.com')).toBeFalsy();
    expect(Str.isEmail('email@domain..com')).toBeFalsy();

    // Dashes
    expect(Str.isEmail('email@-domain.com')).toBeFalsy();
    expect(Str.isEmail('email@-')).toBeFalsy();
    expect(Str.isEmail('email@--')).toBeFalsy();

    // Invalid domain names
    expect(Str.isEmail('email@')).toBeFalsy();
    expect(Str.isEmail('email@ ')).toBeFalsy();
    expect(Str.isEmail('@domain.com')).toBeFalsy();
    expect(Str.isEmail('abc@...')).toBeFalsy();
    expect(Str.isEmail('abc@....')).toBeFalsy();
  });

  it('should validate IP address', () => {
    expect(Str.isIp('172.16.12.3')).toBeTruthy();
    expect(Str.isIp('172.16.abc.3')).toBeFalsy();
    expect(Str.isIp('111.222.333.44444')).toBeFalsy();
  });

  it('should validate domain name', () => {
    expect(Str.isDomainName('domain.com')).toBeTruthy();
    expect(Str.isDomainName('sub.domain.com')).toBeTruthy();
    expect(Str.isDomainName('-domain.com')).toBeFalsy();
    expect(Str.isDomainName('domain.c')).toBeFalsy();
  });
});
