"use strict";

const assert = require("assert");
const comment = require("..").comment;

describe("Parsing comment literals", () => {
    it("should parse inline comment literals as expected", () => {
        assert.strictEqual(comment.parse("// this is a inline comment"), "// this is a inline comment");
        assert.strictEqual(comment.parse("/* this is a inline comment */"), "/* this is a inline comment */");
    });

    it("should parse multi-line comment literals as expected", () => {
        assert.strictEqual(comment.parse("/* this is a\n multi-line comment */"), "/* this is a\n multi-line comment */");
        assert.strictEqual(comment.parse("/* this is\n another\n multi-line comment */"), "/* this is\n another\n multi-line comment */");
    });

    it("should parse comment literals with leading spaces as expected", () => {
        assert.strictEqual(comment.parse(" // this is a inline comment"), "// this is a inline comment");
        assert.strictEqual(comment.parse("  /* this is a inline comment */"), "/* this is a inline comment */");
        assert.strictEqual(comment.parse("   /* this is a\n multi-line comment */"), "/* this is a\n multi-line comment */");
    });

    it("should parse comment literals with trailing characters as expected", () => {
        assert.strictEqual(comment.parse("  /* this is a inline comment */abc"), "/* this is a inline comment */");
        assert.strictEqual(comment.parse("   /* this is a\n multi-line comment */abc"), "/* this is a\n multi-line comment */");
    });

    it("should parse comment literals and strip meaningless characters as expected", () => {
        assert.strictEqual(comment.parse("// this is a inline comment", true), "this is a inline comment");
        assert.strictEqual(comment.parse("/* this is a inline comment */", true), "this is a inline comment");
        assert.strictEqual(comment.parse("/* this is a\n multi-line comment */", true), "this is a multi-line comment");
        assert.strictEqual(comment.parse("/* this is a\n * multi-line comment */", true), "this is a multi-line comment");
        assert.strictEqual(comment.parse("/* this is a\n\n * multi-line comment */", true), "this is a\nmulti-line comment");
        assert.strictEqual(comment.parse("/* this is a\n\n\n * multi-line comment */", true), "this is a\nmulti-line comment");
    });
});

describe("Parsing token from comment literals", () => {
    it("should parse token from comment literals as expected", () => {
        var input = "// this is a inline comment";
        assert.deepStrictEqual(comment.parseToken(input), {
            source: input,
            value: input,
            type: "//",
            offset: 0,
            length: input.length
        });

        input = "/* this is a inline comment */";
        assert.deepStrictEqual(comment.parseToken(input), {
            source: input,
            value: input,
            type: "/*",
            offset: 0,
            length: input.length
        });

        input = "/* this is a\n multi-line comment */";
        assert.deepStrictEqual(comment.parseToken(input), {
            source: input,
            value: input,
            type: "/*",
            offset: 0,
            length: input.length
        });

        input = "/** this is a\n multi-line comment */";
        assert.deepStrictEqual(comment.parseToken(input), {
            source: input,
            value: input,
            type: "/**",
            offset: 0,
            length: input.length
        });
    });

    it("should parse token from comment literals with leading spaces as expected", () => {
        var input = " // this is a inline comment";
        assert.deepStrictEqual(comment.parseToken(input), {
            source: input.slice(1),
            value: input.slice(1),
            type: "//",
            offset: 1,
            length: input.length - 1
        });

        input = "  /* this is a inline comment */";
        assert.deepStrictEqual(comment.parseToken(input), {
            source: input.slice(2),
            value: input.slice(2),
            type: "/*",
            offset: 2,
            length: input.length - 2
        });

        input = "   /** this is a inline comment */";
        assert.deepStrictEqual(comment.parseToken(input), {
            source: input.slice(3),
            value: input.slice(3),
            type: "/**",
            offset: 3,
            length: input.length - 3
        });
    });
});

describe("Generating comments from strings", () => {
    it("should produce inline comments as expected", () => {
        assert.strictEqual(comment.toLiteral("this is a inline comment"), "// this is a inline comment");
        assert.strictEqual(comment.toLiteral("this is a inline comment", "/*"), "/* this is a inline comment */");
    });

    it("should produce multi-line comments as expected", () => {
        assert.strictEqual(comment.toLiteral("this is a\n multi-line comment"), "// this is a\n// multi-line comment");
        assert.strictEqual(comment.toLiteral("this is a\n multi-line comment", "/*"), "/*\n * this is a\n * multi-line comment\n */");
        assert.strictEqual(comment.toLiteral("this is a\n multi-line comment", "/**"), "/**\n * this is a\n * multi-line comment\n */");
    });

    it("should produce multi-line comments with indentation as expected", () => {
        assert.strictEqual(comment.toLiteral("this is a\n multi-line comment", "//", "    "), "// this is a\n    // multi-line comment");
        assert.strictEqual(comment.toLiteral("this is a\n multi-line comment", "/*", "    "), "/*\n     * this is a\n     * multi-line comment\n     */");
        assert.strictEqual(comment.toLiteral("this is a\n multi-line comment", "/**", "    "), "/**\n     * this is a\n     * multi-line comment\n     */");
    });
});