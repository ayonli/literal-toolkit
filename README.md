# Literal Toolkit

**A toolkit to parse and generate JavaScript style literals.**

In case to write a pseudo code implementation or data structure, this toolkit 
will help a lot on parsing and generating strings, numbers, regular expressions,
keyword values, and even comments.

## Install

```sh
$ npm i literal-toolkit
```

## API

There are several interfaces under this package, each of them have the similar 
functions that can be used to parse and generate literals.

- `LiteralToken`
    - `source: string` will exclude any leading spaces.
    - `offset: number` the index position where `source` starts.
    - `length: number` the length of the `source` string.

- `string`
    - `StringToken` extends `LiteralToken`
        - `value: string`
        - <code>quote: "'" | "\"" | "`"</code>
    - `parse(str: string): string`
    - `parseToken(str: string): StringToken`
    - <code>toLiteral(str: string, quote?: "'" | "\"" | "`"): string</code>

- `number`
    - `NumberToken` extends `LiteralToken`
        - `value: number | bigint`
        - `radix: 2 | 8 | 10 | 16`
    - `parse(str: string, strict?: boolean): number | bigint`
    - `parseToken(str: string): NumberToken`
    - `isBin(str: string): boolean`
    - `isOct(str: string): boolean`
    - `isDec(str: string): boolean`
    - `isHex(str: string): boolean`
    - `isNaN(str: string): boolean`
    - `isFinite(str: string): boolean`
    - `isBigInt(str: string): boolean`
    - `toLiteral(num: number | bigint, radix?: 2 | 8 | 10 | 16): string`

- `keyword` Includes `true`, `false`, `null`, `NaN` and `Infinity`
    - `KeywordToken` extends `LiteralToken`
        - `value: true | false | null | number`
    - `parse(str: string): KeywordToken["value"]`
    - `parseToken(str: string): KeywordToken`
    - `toLiteral(keyword: KeywordToken["value"]): string`

- `regexp`
    - `RegExpToken` extends `LiteralToken`
        - `value: RegExp`
    - `parse(str: string): RegExp`
    - `parseToken(str: string): RegExpToken`
    - `toLiteral(re: RegExp): string`

- `comment`
    - `CommentToken` extends `LiteralToken`
        - `value: string`
        - `type: "//" | "/*" | "/**"`
    - `parse(str: string, strip?: boolean): string`
    - `parseToken(str: string): CommentToken`
    - `toLiteral(str: string, type?: "//" | "/*" | "/**", inden?: string): string`

All `parseToken()` functions, when the given string cannot be parsed, will 
return `null` by default.

All `parse()` functions are short-cuts of `parseToken(str).value` (might include
additional features). All these functions, when the given string cannot be 
parsed, will return `undefined` instead.

All `parse()` functions are just for simple parsing usage, when dealing with 
complex scenarios, use `parseToken()` instead.

For detailed API documentation, please redirect to [interface declarations](./index.d.ts).

## Usage

```javascript
import { string, number, keyword, regexp, comment } from "literal-toolkit";

string.parse('"this is a double-quoted string literal"');
string.parse("'this is a single-quoted string literal'");
string.parse("`this is a back-quoted\n and multi-line string`");

number.parse("1234567"); // decimal number: 1234567
number.parse("0b1010101"); // binary number: 0b1010101
number.parse("0o1234567"); // octal number: 0o1234567
number.parse("01234567"); // octal number without 'o': 01234567
number.parse("0x1234567"); // hexadecimal number: 0x1234567

keyword.parse("true"); // boolean: true
keyword.parse("false"); // boolean: false
keyword.parse("null"); // null
keyword.parse("NaN"); // number: NaN
keyword.parse("Infinity"); // number: Infinity

regexp.parse("/[a-zA-Z0-9]/i"); // RegExp: /[a-zA-Z0-9]/i

comment.parse("// this is a single-line comment");
comment.parse("/* this is a inline comment */");
comment.parse("/* this comment contains\n multiple\n lines */");
comment.parse("/** this is a JSDoc comment */");
```

This toolkit is meant to parse any valid JavaScript literal strings (of 
supported types) into real values, so any form that works in JavaScript syntax 
can be parsed by this package, although the above example doesn't cover that 
much. Check the [test](./test) for more examples.