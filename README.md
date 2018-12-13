# Literal Toolkit

**A toolkit to parse and generate JavaScript style literals.**

In case to write a pseudo code implementation or data structure, this toolkit 
will help a lot on parsing and generating strings, numbers, regular expressions,
values in special keywords, and even comments.

## Install

```sh
$ npm i literal-toolkit
```

## API

There are several interfaces under this package, each of them have the similar 
functions that can be used to parse and generate literals.

- `LiteralToken`
    - `source: string`
    - `offset: number`
    - `length: number`

- `string`
    - `StringToken` extends `LiteralToken`
        - `value: string`
        - <code>quote: "'" | "\"" | "`"</code>
    - `parse(str: string): string`
    - `parseToken(str: string): StringToken`
    - `toLiteral(str: string, quote?: "'" | "\"" | "`"): string`

- `number`
    - `NumberToken` extends `LiteralToken`
        - `value: number`
        - `radix: 8 | 10 | 16`
    - `parse(str: string, strict?: boolean): number`
    - `parseToken(str: string, allowTrailings?: boolean): NumberToken`
    - `isOct(str: string): boolean`
    - `isDec(str: string): boolean`
    - `isHex(str: string): boolean`
    - `isNaN(str: string): boolean`
    - `isFinite(str: string): boolean`
    - `toLiteral(num: number, radix?: 8 | 10 | 16): string`

- `keyword` Includes `true`, `false`, `null`, `NaN` and `Infinity`
    `KeywordToken` extends `LiteralToken`
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
return `null` by default, except for `number.parseToken()` that allows you set 
the second argument for parsing numeric strings non-strictly.

All `parse()` functions, except `number.parse()`, when the given string cannot 
be parsed, will return `null` by default. While for `number.parse()`, by default
will parse the given string in non-strict mode, unless setting `strict` argument,
and this function will return `NaN` instead of `null` if given a invalid literal.

All `parse()` functions are just for simple parsing usage, when dealing with 
complex tasks, use `parseToken()` instead.

For detailed API documentation, please reference to [interface declarations](./index.d.ts).