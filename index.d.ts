export declare interface LiteralToken {
    /**
     * The source code of the literal, that means any leading empty characters 
     * (include spaces, new-line symbols, etc.) in the given string will be 
     * ignored by the parser.
     */
    source: string;
    /**
     * The exact position of where the `source` starts, if there aren't any
     * leading empty characters, the offset will be `0`.
     */
    offset: number;
    /**
     * The length (in unicode) of the `source`, a valid token will start from 
     * the head of the given string, and end at `offset + length`.
     */
    length: number;
}

export declare namespace string {
    interface StringToken extends LiteralToken {
        /** The parsed value of the string literal. */
        value: string;
        quote: "'" | "\"" | "`";
    }

    const SINGLE_QUOTE: "'";
    const DOUBLE_QUOTE: '"';
    const BACK_QUOTE: "`";

    /**
     * Parses the given string literal into string value, may return `undefined`
     * if the given string includes unexpected tokens.
     */
    function parse(str: string): string;
    /**
     * Parses the given string literal into a token object that contains useful 
     * meta data of the token, may return `null` if the given string includes 
     * unexpected tokens.
     */
    function parseToken(str: string): StringToken;
    /**
     * Generates a string literal according to the given string. By default, 
     * `quote` is set to `"` (double quote), and the stringifer will automatically
     * escape the same kind of quote in the string, while leaving other quotes 
     * unescaped.
     */
    function toLiteral(str: string, quote?: "'" | "\"" | "`"): string;
}

export declare namespace number {
    interface NumberToken extends LiteralToken {
        /**
         * The parsed value of the number literal (include constants `NaN` and
         * `Infinity`). Unlike built-in `parseInt()`, `parseFloat()` and 
         * `Number()`, this parser is able to automatically detect `radix` of 
         * the given string, just like the JavaScript syntax itself does.
         */
        value: number | bigint;
        radix: 2 | 8 | 10 | 16;
    }

    const BIN: 2;
    const OCT: 8;
    const DEC: 10;
    const HEX: 16;

    /**
     * Parses the given number literal into number value, may return `undefined`
     * if the given string includes unexpected tokens. By default, this function 
     * use non-strict mode, that means if only the leading characters can be 
     * parsed to number, any continuing characters will be ignored. set `strict`
     * to turn off this behavior.
     */
    function parse(str: string, strict?: boolean): number | bigint;
    /**
     * Parses the given number literal into a token object that contains useful 
     * meta data of the token, may return `null` if the given string includes 
     * unexpected tokens.
     */
    function parseToken(str: string): NumberToken;
    /** Checks if the given string can be parsed as an binary number. */
    function isBin(str: string): boolean;
    /** Checks if the given string can be parsed as an octal number. */
    function isOct(str: string): boolean;
    /** Checks if the given string can be parsed as a decimal number. */
    function isDec(str: string): boolean;
    /** Checks if the given string can be parsed as a hexadecimal number. */
    function isHex(str: string): boolean;
    /** Checks if the given string cannot be parsed as a number or is `NaN`. */
    function isNaN(str: string): boolean;
    /** Checks if the given string can be parsed as a finite number. */
    function isFinite(str: string): boolean;
    /** Checks if the given string can be parsed as a BigInt number. */
    function isBigInt(str: string): boolean;
    /**
     * Generates a number literal according to the given number. By default, 
     * `radix` is set to `10` (decimal).
     */
    function toLiteral(num: number, radix?: 2 | 8 | 10 | 16): string;
}

export declare namespace keyword {
    interface KeywordToken extends LiteralToken {
        /** Will either be `true`, `false`, `null`, `Infinity` or `NaN`. */
        value: true | false | null | number;
    }

    /**
     * Parses the given string literal into either `true`, `false`, `null`, 
     * `Infinity` or `NaN`, may return `undefined` if the given string includes 
     * unexpected tokens.
     */
    function parse(str: string): KeywordToken["value"];
    /**
     * Parses the given keyword literal into a token object that contains useful 
     * meta data of the token, may return `null` if the given string includes 
     * unexpected tokens.
     */
    function parseToken(str: string): KeywordToken;
    /** Generates a keyword literal according to the given keyword. */
    function toLiteral(keyword: KeywordToken["value"]): string;
}

export declare namespace regexp {
    interface RegExpToken extends LiteralToken {
        /**
         * NOTICE: regular expression flags are not always valid, before ES2015, 
         * flags `s`, `u` and `y` are not supported.
         */
        value: RegExp;
    }

    /**
     * Parses the given regexp literal into RegExp instance, may return 
     * `undefined` if the given string includes unexpected tokens.
     */
    function parse(str: string): RegExp;
    /**
     * Parses the given regexp literal into a token object that contains useful 
     * meta data of the token, may return `null` if the given string includes 
     * unexpected tokens.
     */
    function parseToken(str: string): RegExpToken;
    /** Generates a regexp literal according to the given RegExp instance. */
    function toLiteral(re: RegExp): string;
}

export declare namespace comment {
    interface CommentToken extends LiteralToken {
        value: string,
        type: "//" | "/*" | "/**"
    }

    /**
     * Parses the given comment literal into string value, may return 
     * `undefined` if the given string includes unexpected tokens. If `strip` is
     * set, the parser will automatically strip meaningless characters.
     */
    function parse(str: string, strip?: boolean): string;
    /**
     * Parses the given regexp literal into a token object that contains useful 
     * meta data of the token, may return `null` if the given string includes 
     * unexpected tokens.
     */
    function parseToken(str: string): CommentToken;
    /**
     * Generates a comment literal according to the given string. By default, 
     * `type` is set to `//` (single-line comment). The stringifier will 
     * automatically detect what style of comment should be produced according 
     * to the setting type and the given string itself. If `indent` is set 
     * (usually spaces), the generated comment will contain indentation since 
     * the second line.
     */
    function toLiteral(str: string, type?: "//" | "/*" | "/**", indent?: string): string;
}