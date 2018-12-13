export declare interface LiteralToken {
    source: string;
    offset: number;
    length: number;
}

export declare namespace string {
    const SINGLE_QUOTE: "'";
    const DOUBLE_QUOTE: '"';
    const BACK_QUOTE: "`";
    interface StringToken extends LiteralToken {
        value: string;
        quote: "'" | "\"" | "`";
    }
    function parse(str: string): string;
    function parseToken(str: string): StringToken;
    function toLiteral(str: string, quote?: "'" | "\"" | "`"): string;
}

export declare namespace number {
    const OCT: 8;
    const DEC: 10;
    const HEX: 16;
    interface NumberToken extends LiteralToken {
        value: number;
        radix: 8 | 10 | 16;
    }
    function parse(str: string, strict?: boolean): number;
    function parseToken(str: string, allowTrailings?: boolean): NumberToken;
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