"use strict";

const assert = require("assert");
const keyword = require("..").keyword;

describe("Parsing keyword literals", () => {
    it("should parse keyword literals as expected", () => {
        assert.strictEqual(keyword.parse("true"), true);
        assert.strictEqual(keyword.parse("false"), false);
        assert.strictEqual(keyword.parse("null"), null);
        assert.strictEqual(keyword.parse("Infinity"), Infinity);
        assert.ok(isNaN(keyword.parse("NaN")));
    });

    it("should parse keyword literals with leading spaces as expected", () => {
        assert.strictEqual(keyword.parse(" true"), true);
        assert.strictEqual(keyword.parse("  false"), false);
        assert.strictEqual(keyword.parse("   null"), null);
        assert.strictEqual(keyword.parse("    Infinity"), Infinity);
        assert.ok(isNaN(keyword.parse("        NaN")));
    });

    it("should parse keyword literals with trailing boundaries as expected", () => {
        assert.strictEqual(keyword.parse("true "), true);
        assert.strictEqual(keyword.parse("false,"), false);
        assert.strictEqual(keyword.parse("null;"), null);
        assert.strictEqual(keyword.parse("Infinity]"), Infinity);
        assert.ok(isNaN(keyword.parse("NaN}")));
    });
});

describe("Parsing tokens from keyword literals", () => {
    it("should parse tokens from keyword literals as expected", () => {
        assert.deepStrictEqual(keyword.parseToken("true"), {
            source: "true",
            value: true,
            offset: 0,
            length: 4
        });
        assert.deepStrictEqual(keyword.parseToken("false"), {
            source: "false",
            value: false,
            offset: 0,
            length: 5
        });
        assert.deepStrictEqual(keyword.parseToken("null"), {
            source: "null",
            value: null,
            offset: 0,
            length: 4
        });
        assert.deepStrictEqual(keyword.parseToken("Infinity"), {
            source: "Infinity",
            value: Infinity,
            offset: 0,
            length: 8
        });

        var token = keyword.parseToken("NaN");
        assert.ok(isNaN(token.value));
        assert.strictEqual(token.source, "NaN");
        assert.strictEqual(token.offset, 0);
        assert.strictEqual(token.length, 3);
        assert.deepStrictEqual(Object.keys(token), ["source", "offset", "length", "value"]);
    });

    it("should parse token from keyword literals with leading spaces as expected", () => {
        assert.deepStrictEqual(keyword.parseToken(" true"), {
            source: "true",
            value: true,
            offset: 1,
            length: 4
        });
        assert.deepStrictEqual(keyword.parseToken("  false"), {
            source: "false",
            value: false,
            offset: 2,
            length: 5
        });
        assert.deepStrictEqual(keyword.parseToken("   null"), {
            source: "null",
            value: null,
            offset: 3,
            length: 4
        });
        assert.deepStrictEqual(keyword.parseToken("    Infinity"), {
            source: "Infinity",
            value: Infinity,
            offset: 4,
            length: 8
        });

        var token = keyword.parseToken("     NaN");
        assert.ok(isNaN(token.value));
        assert.strictEqual(token.source, "NaN");
        assert.strictEqual(token.offset, 5);
        assert.strictEqual(token.length, 3);
        assert.deepStrictEqual(Object.keys(token), ["source", "offset", "length", "value"]);
    });
});

describe("Generating keyword literals from values", () => {
    it("should produce 'true', 'false', 'null', 'NaN' and 'Infinity' as expected", () => {
        assert.strictEqual(keyword.toLiteral(true), "true");
        assert.strictEqual(keyword.toLiteral(false), "false");
        assert.strictEqual(keyword.toLiteral(null), "null");
        assert.strictEqual(keyword.toLiteral(NaN), "NaN");
        assert.strictEqual(keyword.toLiteral(Infinity), "Infinity");
    });
});