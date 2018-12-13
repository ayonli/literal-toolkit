"use strict";

const assert = require("assert");
const regexp = require("..").regexp;

describe("Parsing regular expression literals", () => {
    it("should parse regular expressions as expected", () => {
        var re = regexp.parse("/[a-z]/i");
        var re2 = /[a-z]/i;
        var result = { source: re.source, flags: re.flags };
        var expected = { source: re2.source, flags: re2.flags };
        assert.deepStrictEqual(result, expected);

        re = regexp.parse("/[a-z]/im");
        re2 = /[a-z]/im;
        result = { source: re.source, flags: re.flags };
        expected = { source: re2.source, flags: re2.flags };
        assert.deepStrictEqual(result, expected);

        re = regexp.parse("/[a-z]/gimsuy");
        re2 = /[a-z]/gimsuy;
        result = { source: re.source, flags: re.flags };
        expected = { source: re2.source, flags: re2.flags };
        assert.deepStrictEqual(result, expected);

        re = regexp.parse("/^\\s*\\/\\/.*\\n*?/");
        re2 = /^\s*\/\/.*\n*?/;
        result = { source: re.source, flags: re.flags };
        expected = { source: re2.source, flags: re2.flags };
        assert.deepStrictEqual(result, expected);
    });

    it("should parse regular expressions with leading spaces as expected", () => {
        var re = regexp.parse(" /[a-z]/i");
        var re2 = /[a-z]/i;
        var result = { source: re.source, flags: re.flags };
        var expected = { source: re2.source, flags: re2.flags };
        assert.deepStrictEqual(result, expected);
    });

    it("should parse regular expressions with trailing boundaries as expected", () => {
        var re = regexp.parse("/[a-z]/i,");
        var re2 = /[a-z]/i;
        var result = { source: re.source, flags: re.flags };
        var expected = { source: re2.source, flags: re2.flags };
        assert.deepStrictEqual(result, expected);

        re = regexp.parse("/[a-z]/im;");
        re2 = /[a-z]/im;
        result = { source: re.source, flags: re.flags };
        expected = { source: re2.source, flags: re2.flags };
        assert.deepStrictEqual(result, expected);

        re = regexp.parse("/[a-z]/gimsuy]");
        re2 = /[a-z]/gimsuy;
        result = { source: re.source, flags: re.flags };
        expected = { source: re2.source, flags: re2.flags };
        assert.deepStrictEqual(result, expected);

        re = regexp.parse("/^\\s*\\/\\/.*\\n*?/}");
        re2 = /^\s*\/\/.*\n*?/;
        result = { source: re.source, flags: re.flags };
        expected = { source: re2.source, flags: re2.flags };
        assert.deepStrictEqual(result, expected);
    });

    it("should return null if the literal is invalid", () => {
        assert.strictEqual(regexp.parse("a/[a-z]/i"), undefined);
        assert.strictEqual(regexp.parse("//[a-z]/i"), undefined);
        assert.strictEqual(regexp.parse("/[a-z]//i"), undefined);
        assert.strictEqual(regexp.parse("/[a-z]/a"), undefined);
    });
});

describe("Parsing tokens from regular expression literals", () => {
    it("should parse tokens from regular expressions as expected", () => {
        var token = regexp.parseToken("/[a-z]/i");
        var re = /[a-z]/i;
        var result = {
            offset: token.offset,
            length: token.length,
            source: token.value.source,
            flags: token.value.flags
        };
        var expected = {
            offset: 0,
            length: String(re).length,
            source: re.source,
            flags: re.flags
        };
        assert.deepStrictEqual(result, expected);
    });

    it("should parse token from regular expressions with leading spaces as expected", () => {
        var token = regexp.parseToken("  /[a-z]/i");
        var re = /[a-z]/i;
        var result = {
            offset: token.offset,
            length: token.length,
            source: token.value.source,
            flags: token.value.flags
        };
        var expected = {
            offset: 2,
            length: String(re).length,
            source: re.source,
            flags: re.flags
        };
        assert.deepStrictEqual(result, expected);
    });

    it("should parse token from regular expressions with trailing boundary as expected", () => {
        var token = regexp.parseToken("  /[a-z]/i,");
        var re = /[a-z]/i;
        var result = {
            offset: token.offset,
            length: token.length,
            source: token.value.source,
            flags: token.value.flags
        };
        var expected = {
            offset: 2,
            length: String(re).length,
            source: re.source,
            flags: re.flags
        };
        assert.deepStrictEqual(result, expected);
    });
});

describe("Generating literals from regular expressions", () => {
    it("should generate regular expression literals as expected", () => {
        assert.strictEqual(regexp.toLiteral(/[a-z]/i), "/[a-z]/i");
        assert.strictEqual(regexp.toLiteral(/^\s*\/\/.*\n*?/), "/^\\s*\\/\\/.*\\n*?/");
    });
});