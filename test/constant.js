"use strict";

const assert = require("assert");
const constant = require("..").constant;

describe("Parsing constant literals", () => {
    it("should parse constant literals as expected", () => {
        assert.strictEqual(constant.parse("true"), true);
        assert.strictEqual(constant.parse("false"), false);
        assert.strictEqual(constant.parse("null"), null);
        assert.strictEqual(constant.parse("Infinity"), Infinity);
        assert.ok(isNaN(constant.parse("NaN")));
    });

    it("should parse constant literals with leading spaces as expected", () => {
        assert.strictEqual(constant.parse(" true"), true);
        assert.strictEqual(constant.parse("  false"), false);
        assert.strictEqual(constant.parse("   null"), null);
        assert.strictEqual(constant.parse("    Infinity"), Infinity);
        assert.ok(isNaN(constant.parse("        NaN")));
    });

    it("should parse constant literals with trailing boundaries as expected", () => {
        assert.strictEqual(constant.parse("true "), true);
        assert.strictEqual(constant.parse("false,"), false);
        assert.strictEqual(constant.parse("null;"), null);
        assert.strictEqual(constant.parse("Infinity]"), Infinity);
        assert.ok(isNaN(constant.parse("NaN}")));
    });
});

describe("Parsing tokens from constant literals", () => {
    it("should parse token from constant literals as expected", () => {
        assert.deepStrictEqual(constant.parseToken("true"), {
            value: true,
            offset: 0,
            length: 4
        });
        assert.deepStrictEqual(constant.parseToken("false"), {
            value: false,
            offset: 0,
            length: 5
        });
        assert.deepStrictEqual(constant.parseToken("null"), {
            value: null,
            offset: 0,
            length: 4
        });
        assert.deepStrictEqual(constant.parseToken("NaN"), {
            value: NaN,
            offset: 0,
            length: 3
        });
        assert.deepStrictEqual(constant.parseToken("Infinity"), {
            value: Infinity,
            offset: 0,
            length: 8
        });
    });

    it("should parse token from constant literals with leading spaces as expected", () => {
        assert.deepStrictEqual(constant.parseToken(" true"), {
            value: true,
            offset: 1,
            length: 4
        });
        assert.deepStrictEqual(constant.parseToken("  false"), {
            value: false,
            offset: 2,
            length: 5
        });
        assert.deepStrictEqual(constant.parseToken("   null"), {
            value: null,
            offset: 3,
            length: 4
        });
        assert.deepStrictEqual(constant.parseToken("    NaN"), {
            value: NaN,
            offset: 4,
            length: 3
        });
        assert.deepStrictEqual(constant.parseToken("     Infinity"), {
            value: Infinity,
            offset: 5,
            length: 8
        });
    });
});

describe("Generating constant literals from values", () => {
    it("should produce 'true', 'false', 'null', 'NaN' and 'Infinity' as expected", () => {
        assert.strictEqual(constant.toLiteral(true), "true");
        assert.strictEqual(constant.toLiteral(false), "false");
        assert.strictEqual(constant.toLiteral(null), "null");
        assert.strictEqual(constant.toLiteral(NaN), "NaN");
        assert.strictEqual(constant.toLiteral(Infinity), "Infinity");
    });
});