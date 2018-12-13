"use strict";

const assert = require("assert");
const string = require("..").string;

describe("Parsing string literals", () => {
    it("should parse single-line strings as expected", () => {
        var input = '"this is a single-line string"';
        var expected = "this is a single-line string";
        assert.equal(string.parse(input), expected);

        input = "'this is a single-line string'";
        assert.equal(string.parse(input), expected);

        input = "`this is a single-line string`";
        assert.equal(string.parse(input), expected);
    });

    it("should parse single-line strings with quotes as expected", () => {
        var input = '"this\' is\\" a` single-line string with quotes"';
        var expected = "this' is\" a` single-line string with quotes";
        assert.equal(string.parse(input), expected);

        input = "'this\\' is\" a` single-line string with quotes'";
        assert.equal(string.parse(input), expected);

        input = "`this' is\" a\\` single-line string with quotes'";
        assert.equal(string.parse(input), expected);
    });

    it("should parse multi-line strings as expected", () => {
        var input = '"this is a\\\n pseudo multi-line\\\n string"';
        var expected = "this is a pseudo multi-line string";
        assert.equal(string.parse(input), expected);

        input = "'this is a\\\n pseudo multi-line\\\n string'";
        assert.equal(string.parse(input), expected);

        input = "`this is a\\\n pseudo multi-line\\\n string`";
        assert.equal(string.parse(input), expected);

        var input = "`this is a\n real multi-line\n string`";
        var expected = "this is a\n real multi-line\n string";
        assert.equal(string.parse(input), expected);
    });

    it("should parse the string with unnecessary backslashes as expected", () => {
        var input = '"this is a string with unnecessary backslash\\es"';
        var expected = "this is a string with unnecessary backslash\es";
        assert.equal(string.parse(input), expected);
    });

    it("should parse the string with leading spaces as expected", () => {
        var input = "  'this is a string literal with two leading spaces'";
        var expected = "this is a string literal with two leading spaces";
        assert.equal(string.parse(input), expected);
    });

    it("should parse the string with trailing spaces as expected", () => {
        var input = "'this is a string literal with two trailing spaces'  ";
        var expected = "this is a string literal with two trailing spaces";
        assert.equal(string.parse(input), expected);
    });

    it("should parse the strings with trailing boundaries as expected", () => {
        var input = "'this is a string literal with two trailing spaces',";
        var expected = "this is a string literal with two trailing spaces";
        assert.equal(string.parse(input), expected);

        input = "'this is a string literal with two trailing spaces';";
        assert.equal(string.parse(input), expected);

        input = "'this is a string literal with two trailing spaces']";
        assert.equal(string.parse(input), expected);

        input = "'this is a string literal with two trailing spaces'}";
        assert.equal(string.parse(input), expected);
    });

    it("should return null if the string contains unexpected token", () => {
        assert.strictEqual(string.parse("abc'this is a invalid string literal'"), null);
        assert.strictEqual(string.parse("'this is a invalid\n string literal'"), null);
    });
});

describe("Parsing tokens from string literals", () => {
    it("should parse the single-line string as expected", () => {
        var input = '"this is a single-line string"';
        var expected = {
            source: input,
            quote: '"',
            value: "this is a single-line string",
            offset: 0,
            length: input.length
        };
        assert.deepStrictEqual(string.parseToken(input), expected);
    });
    
    it("should parse the single-line string with leading spaces as expected", () => {
        var input = '    "this is a single-line string"';
        var expected = {
            source: input.slice(4),
            quote: '"',
            value: "this is a single-line string",
            offset: 4,
            length: input.length - 4
        };
        assert.deepStrictEqual(string.parseToken(input), expected);
    });

    it("should parse the multi-line string as expected", () => {
        var input = '"this is a\\\n multi-line string"';
        var expected = {
            source: input,
            quote: '"',
            value: "this is a multi-line string",
            offset: 0,
            length: input.length
        };
        assert.deepStrictEqual(string.parseToken(input), expected);

        var input = '`this is another\n multi-line string`';
        var expected = {
            source: input,
            quote: '`',
            value: "this is another\n multi-line string",
            offset: 0,
            length: input.length
        };
        assert.deepStrictEqual(string.parseToken(input), expected);
    });
});

describe("Generating string literals from strings", () => {
    it("should produce single-line string literal as expected", () => {
        var input = "this is a single-quoted string";
        var expected = "'this is a single-quoted string'";
        assert.equal(string.toLiteral(input, "'"), expected);

        input = "this is a double-quoted string";
        expected = '"this is a double-quoted string"';
        assert.equal(string.toLiteral(input, '"'), expected);

        input = "this is a back-quoted string";
        expected = '`this is a back-quoted string`';
        assert.equal(string.toLiteral(input, '`'), expected);
    });

    it("should produce multi-line string literal as expected", () => {
        var input = "this is a\n single-quoted string";
        var expected = "'this is a\\n single-quoted string'";
        assert.equal(string.toLiteral(input, "'"), expected);
    });
});