# AWAI Toolbox

Set of tools you'll always need. So, just `npm install --save @awai/toolbox` and have it always at hand.

## Resources
* Sources: https://github.com/agroupp/awai/tree/master/libs/toolbox
* Source Code Documentation: https://agroupp.github.io/awai/toolbox/

## Str
Set of helper constants and methods for text processing.


### Accessors
Accessor | Description
---------|------------
empty | Empty string
englishLettersOrdered | Ordered set of lowercase English letters

### Methods
Method | Description
-------|-------------
capitalize(str: string) | Return a copy of the string with its first character capitalized and the rest lowercased
isAlpha(str: string) | Return `true` if all characters in the string are alpha only
isControl(char: string) | Return `true` if char is ASCII control symbol
isDomainName(str: string) | Return `true` if string looks like a valid domain name
isEmail(str: string) | Return `true` if string is a valid email address
isIp(str: string) | Return `true` if string is a valid IP address
isLower(str: string) | Return `true` if all characters in the string are lowercase
isNullOrEmpty(str: string) | Return `true` if a specified string is null or empty
isNullOrWhiteSpace(str: string) | Return `true` if a specified string is null, empty, or consists only of white-space characters
isNumber(str: string) | Return `true` if all characters in the string are digits only
isUpper(str: string) | Return `true` if all characters in the string are uppercase
parseNumBool(str: string) | Try to find number or boolean value in a provided string and return converted value
random(size: number, alphaLower, alphaUpper, decimal) | Generate alpha numeric random sequence string
splitLines(str: string) | Return an array of the lines in the string, breaking at line boundaries
swapCase(str: string) | Return a copy of the string with uppercase characters converted to lowercase and vice versa
wrapInHtmlTag(str: string, term: string, tagName: string, tagClasses: string[]) | Return source text with "term" wrapped by specified HTML tag


## Arr
Provides a set of helper methods for arrays.

### Accessors
Accessor | Description
---------|------------
englishLettersOrdered | Ordered set of lowercase English letters
englishLettersUppercaseOrdered | Ordered set of upercase English letters

### Methods
Method | Description
-------|-------------
bytesToFloat(bytes: Uint8Array) | Convert array of bytes into array of floats within range [0.0, 1.0]
first(arr: Array) | Return the first element of a specified array
isNullOrEmpty(arr: Array) | Return `true` if a specified array is null or empty
last(arr: Array) | Return the last element of a specified array
range(size: number, start: number) | Return array filled by range of integers
removeEmptyStrings(arr: string[]) | Remove empty string elements from string array
shuffle(arr: Array) | Shuffle the array by method [Fisher–Yates](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
stringToCharArray(str: string) | Convert string into array of chars


## Random
Provides a set of helper methods to generate cryptographically strong random values.

### Methods (RandomBytesProvider)
Method | Description
-------|-------------
nextBytes(size: number) | Return array of random bytes
nextBytesAsync(size: number) | Return promise that resolves to array of random bytes


### Methods (Rnd)
Method | Description
-------|-------------
nextFloat(qty: number) | Return a random floating-point number or array of random floating-point numbers that is greater than or equal to 0.0, and less than 1.0
nextFloatAsync(qty: number) | Return a promise that resolves to random floating-point number or array of random floating-point numbers that is greater than or equal to 0.0, and less than 1.0
nextInt(min: number, max: number, qty: number) | Return a random integer or array of random integers that is within a specified range
nextIntAsync(min: number, max: number, qty: number) | Return a promise that resolves to random integer or array of random integers that is within a specified range


## Url
The Url class is used to parse or create from 0 the URL. It gives you different property accessors that allow you easily access or set parts of the URL. Create the Url instance with the uri string or empty to construct it from zero.

### Methods
Method | Description
-------|-------------
isUrl(value: string) | Return true if provided value can be parsed as valid URI
toString() | Return string representation of the whole URL
toURL() | Return `URL` object

### Accessors
Accessor | Description
---------|------------
protocol | IANA-registered scheme or protocol
domain | Name of the domain or IP address
port | IP port number
username | Username for HTTP Authentication
password | Password for HTTP Authentication
pathString | Route path in form /route/path
pathParams | Route path as array of its parts
path | Route path in form /route/path
queryParams | Map of query params as a key - value. Values are parsed as strings, numbers and booleans
hashFragment | Hash fragment
isSsl | Return true if SSL is used


## Running unit tests

Run `nx test toolbox` to execute the unit tests via [Jest](https://jestjs.io).
