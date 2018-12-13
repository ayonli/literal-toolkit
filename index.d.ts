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
     * Parses the given string literal into string value, may return `null` if 
     * the given string includes unexpected tokens.
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
     * `quote` is set `"` (double quote), and the stringifer will automatically
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
        value: number;
        radix: 8 | 10 | 16;
    }

    const OCT: 8;
    const DEC: 10;
    const HEX: 16;

    /**
     * Parses the given number literal into number value, may return `null` if 
     * the given string includes unexpected tokens. By default, this function 
     * use non-strict mode, that means if only the leading characters can be 
     * parsed to number, any continuing characters will be ignored. Set `strict`
     * to turn off this behavior.
     */
    function parse(str: string, strict?: boolean): number;
    /**
     * Parses the given number literal into a token object that contains useful 
     * meta data of the token, may return `null` if the given string includes 
     * unexpected tokens.
     */
    function parseToken(str: string): NumberToken;
    function isOct(str: string): boolean;
    function isDec(str: string): boolean;
    function isHex(str: string): boolean;
    function isNaN(str: string): boolean;
    function isFinite(str: string): boolean;
    function toLiteral(num: number, radix?: 8 | 10 | 16): string;
}

export declare namespace keyword {
    interface KeywordToken extends LiteralToken {
        value: true | false | null | number;
    }

    function parse(str: string): KeywordToken["value"];
    function parseToken(str: string): KeywordToken;
    function toLiteral(keyword: KeywordToken["value"]): string;
}

export declare namespace regexp {
    interface RegExpToken extends LiteralToken {
        value: RegExp;
    }

    function parse(str: string): RegExp;
    function parseToken(str: string): RegExpToken;
    function toLiteral(re: RegExp): string;
}

export declare namespace comment {
    interface CommentToken extends LiteralToken {
        value: string,
        type: "//" | "/*" | "/**"
    }

    function parse(str: string, strip?: boolean): string;
    function parseToken(str: string): CommentToken;
    function toLiteral(str: string, type?: "//" | "/*" | "/**", inden?: string): string;
}