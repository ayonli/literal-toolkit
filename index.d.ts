export declare interface LiteralToken {
    source: string;
    offset: number;
    length: number;
}

export declare namespace string {
    interface StringToken extends LiteralToken {
        value: string;
        quote: "'" | "\"" | "`";
    }
    function parse(str: string): string;
    function parseToken(str: string): StringToken;
    function toLiteral(str: string, quote?: "'" | "\"" | "`"): string;
}

export declare namespace number {
    interface NumberToken extends LiteralToken {
        value: number;
        radix: 8 | 10 | 16;
    }
    function parse(str: string): number;
    function parseToken(str: string): NumberToken;
    function isOct(str: string): boolean;
    function isDec(str: string): boolean;
    function isHex(str: string): boolean;
    function isNaN(str: string): boolean;
    function isFinite(str: string): boolean;
    function toLiteral(num: number, radix?: 8 | 10 | 16): string;
}

export declare namespace keyword {
    interface KeywordToken {
        value: true | false | null | number;
    }
    function parse(str: string): KeywordToken["value"];
    function parseToken(str: string): KeywordToken;
    function toLiteral(keyword: KeywordToken["value"]): string;
}

export declare namespace regexp {
    interface RegExpToken {
        value: RegExp;
    }
    function parse(str: string): RegExp;
    function parseToken(str: string): RegExpToken;
    function toLiteral(re: RegExp): string;
}

export declare namespace comment {
    interface CommentToken {
        value: string,
        type: "//" | "/*" | "/**"
    }
    function parse(str: string, strip?: boolean): string;
    function parseToken(str: string): CommentToken;
    function toLiteral(str: string, type?: "//" | "/*" | "/**", inden?: string): string;
}