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

  it('should check if all characters are digits', () => {
    expect(Str.isNumber('123')).toBeTruthy();
    expect(Str.isNumber('123a')).toBeFalsy();
  });

  it('should check if all characters are alphas', () => {
    expect(Str.isAlpha('Abc')).toBeTruthy();
    expect(Str.isAlpha('123a')).toBeFalsy();
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
    expect(Str.isDomainName('localhost')).toBeTruthy();
  });

  it('should detect control character', () => {
    expect(Str.isControl(String.fromCharCode(10))).toBeTruthy();
    expect(Str.isControl(String.fromCharCode(27))).toBeTruthy();
    expect(Str.isControl(' ')).toBeFalsy();
    expect(Str.isControl('A')).toBeFalsy();
  });

  it('should wrap part of text into html tag', () => {
    const text = `who also wrote the majority opinion in the Texas Case, wrote the majority opinion here`;
    expect(Str.wrapInHtmlTag(text, 'majority', 'em'))
    .toEqual(`who also wrote the <em>majority</em> opinion in the Texas Case, wrote the <em>majority</em> opinion here`);

    expect(Str.wrapInHtmlTag(text, 'majority', 'em', ['bold', 'italic']))
    .toEqual(`who also wrote the <em class="bold italic">majority</em> opinion in the Texas Case, wrote the <em class="bold italic">majority</em> opinion here`);

    expect(Str.wrapInHtmlTag(text, 'Texas Case', 'em'))
    .toEqual(`who also wrote the majority opinion in the <em>Texas Case</em>, wrote the majority opinion here`);

    expect(Str.wrapInHtmlTag(text, 'Texas Case', 'em', ['bold', 'italic']))
    .toEqual(`who also wrote the majority opinion in the <em class="bold italic">Texas Case</em>, wrote the majority opinion here`);
  });

  it('should generate random alpha string', () => {
    const full1 = Str.random();
    const full2 = Str.random();
    const alphaOnly = Str.random(10, true, true, false);
    const decOnly = Str.random(10, false, false, true);
    const alphaUpperDec = Str.random(10, false, true, true);
    expect(full1).not.toEqual(full2);
    expect(full1.length).toEqual(8);
    expect(full2.length).toEqual(8);
    expect(Str.isAlpha(alphaOnly)).toBeTruthy();
    expect(Str.isNumber(decOnly)).toBeTruthy();
    expect(Str.isUpper(alphaUpperDec)).toBeTruthy();
  });

  it('should return value converted to correct type', () => {
    expect(Str.parseNumBool('25')).toEqual(25);
    expect(Str.parseNumBool('true')).toEqual(true);
    expect(Str.parseNumBool('True')).toEqual(true);
    expect(Str.parseNumBool('False')).toEqual(false);
    expect(Str.parseNumBool('TRUE ')).toEqual(true);
    expect(Str.parseNumBool('abc')).toEqual('abc');
  });
});
