const assert = require("assert");
const number = require("..").number;

describe("Testing numbers from strings", () => {
    it("should check octal numbers as expected", () => {
        assert.strictEqual(number.isOct("01234567"), true);
        assert.strictEqual(number.isOct("012345678"), false);
        assert.strictEqual(number.isOct("01010101"), true);
    });

    it("should check decimal numbers as expected", () => {
        assert.strictEqual(number.isDec("1234567"), true);
        assert.strictEqual(number.isDec("01234567"), false);
        assert.strictEqual(number.isDec("012345678"), true);
        assert.strictEqual(number.isDec("012345678.123"), true);
        assert.strictEqual(number.isDec("1e12"), true);
        assert.strictEqual(number.isDec("1.1e12"), true);
    });

    it("should check hexadecimal numbers as expected", () => {
        assert.strictEqual(number.isHex("0x1f"), true);
        assert.strictEqual(number.isHex("0x1F "), true);
        assert.strictEqual(number.isHex("0x1G"), false);
        assert.strictEqual(number.isHex("01F"), false);
    });

    it("should check NaN and Infinity as expected", () => {
        assert.strictEqual(number.isNaN("NaN"), true);
        assert.strictEqual(number.isNaN("nan"), true);

        assert.strictEqual(number.isFinite("Infinity"), false);
        assert.strictEqual(number.isFinite("NaN"), false);
        assert.strictEqual(number.isFinite("nan"), false);
    });
});

describe("Parsing numbers from strings", () => {
    it("should parse octal numbers as expected", () => {
        assert.strictEqual(number.parse("01234567"), 01234567);
    });

    it("should parse decimal numbers as expected", () => {
        assert.strictEqual(number.parse("1234567"), 1234567);
        assert.strictEqual(number.parse("1234567.123"), 1234567.123);
        assert.strictEqual(number.parse("0123456789"), 123456789);
    });

    it("should parse hexadecimal numbers as expected", () => {
        assert.strictEqual(number.parse("0x1234567"), 0x1234567);
        assert.strictEqual(number.parse("0x123abc"), 0x123abc);
        assert.strictEqual(number.parse("0x123abc.123"), 0x123abc);
    });

    it("should parse numbers with signed marks as expected", () => {
        assert.strictEqual(number.parse("+01234567"), 01234567);
        assert.strictEqual(number.parse("-01234567"), -01234567);
        assert.strictEqual(number.parse("+1234567"), 1234567);
        assert.strictEqual(number.parse("+1234567.123"), 1234567.123);
        assert.strictEqual(number.parse("-1234567"), -1234567);
        assert.strictEqual(number.parse("-1234567.123"), -1234567.123);
        assert.strictEqual(number.parse("+0x123abc"), 0x123abc);
        assert.strictEqual(number.parse("-0x123abc"), -0x123abc);
    });

    it("should parse scientific numbers as expected", () => {
        assert.strictEqual(number.parse("123e10"), 123e10);
        assert.strictEqual(number.parse("123E10"), 123E10);
        assert.strictEqual(number.parse("1.1e10"), 1.1e10);
    });

    it("should parse numbers with leading spaces as expected", () => {
        assert.strictEqual(number.parse(" 01234567"), 01234567);
        assert.strictEqual(number.parse("  1234567"), 1234567);
        assert.strictEqual(number.parse("   1234567.123"), 1234567.123);
        assert.strictEqual(number.parse("    0x123abc"), 0x123abc);
    });

    it("should parse numbers with trailing characters as expected", () => {
        assert.strictEqual(number.parse("01234567abc"), 01234567);
        assert.strictEqual(number.parse("01234567.123"), 01234567);
        assert.strictEqual(number.parse("01234567 "), 01234567);
        assert.strictEqual(number.parse("1234567abc"), 1234567);
        assert.strictEqual(number.parse("1234567.123abc"), 1234567.123);
        assert.strictEqual(number.parse("1234567.123.123"), 1234567.123);
        assert.strictEqual(number.parse("0x123abc.123"), 0x123abc);
    });

    it("should parse numbers in strict mode as expected", () => {
        assert.strictEqual(number.parse("01234567", true), 01234567);
        assert.strictEqual(number.parse("1234567", true), 1234567);
        assert.strictEqual(number.parse(" 01234567", true), 01234567);
        assert.strictEqual(number.parse("  0123456789", true), 123456789);
        assert.strictEqual(number.parse("   0x123abc", true), 0x123abc);
        assert.strictEqual(number.parse("01234567 ", true), 01234567);
        assert.strictEqual(number.parse("1234567  ", true), 1234567);
        assert.strictEqual(number.parse("01234567  ", true), 01234567);
        assert.strictEqual(number.parse("0123456789  ", true), 123456789);
        assert.strictEqual(number.parse("0x123abc   ", true), 0x123abc);
    });

    it("should parse numbers with trailing boundaries in strict mode as expected", () => {
        assert.strictEqual(number.parse("01234567,", true), 01234567);
        assert.strictEqual(number.parse("1234567;", true), 1234567);
        assert.strictEqual(number.parse("01234567]", true), 01234567);
        assert.strictEqual(number.parse("0123456789}", true), 123456789);
    });

    it("should parse invalid literals to NaN as expected", () => {
        assert.ok(isNaN(number.parse("this is obviously not a number")));
        assert.ok(isNaN(number.parse("abc1234567")));
        assert.ok(isNaN(number.parse("01234567abc", true)));
        assert.ok(isNaN(number.parse("01234567abc", true)));
        assert.ok(isNaN(number.parse("-01234567abc", true)));
        assert.ok(isNaN(number.parse("+01234567abc", true)));
        assert.ok(isNaN(number.parse("01234567.123", true)));
        assert.ok(isNaN(number.parse("1234567.123.123", true)));
        assert.ok(isNaN(number.parse("0x123abc.123", true)));
        assert.ok(isNaN(number.parse("0x123abc 123", true)));
    });
});

describe("Parsing tokens from number literals", () => {
    it("should parse the number literal as expected", () => {
        assert.deepStrictEqual(number.parseToken("012345"), {
            source: "012345",
            radix: 8,
            value: 012345,
            offset: 0,
            length: 6
        });
    });

    it("should parse the number literal with leading spaces as expected", () => {
        assert.deepStrictEqual(number.parseToken("    012345"), {
            source: "012345",
            radix: 8,
            value: 012345,
            offset: 4,
            length: 6
        });
    });


    it("should parse the number literal with trailing boundaries as expected", () => {
        assert.deepStrictEqual(number.parseToken("012345,"), {
            source: "012345",
            radix: 8,
            value: 012345,
            offset: 0,
            length: 6
        });
    });

    it("should return null when the number literal is invalid", () => {
        assert.strictEqual(number.parseToken("012345abc"), null);
    });
});

describe("Generating number literals from numbers", () => {
    it("should produce octal, decimal and hexadecimal numbers as expected", () => {
        assert.strictEqual(number.toLiteral(12345, 8), "030071");
        assert.strictEqual(number.toLiteral(12345, number.OCT), "030071");
        assert.strictEqual(number.toLiteral(12345, 10), "12345");
        assert.strictEqual(number.toLiteral(12345, number.DEC), "12345");
        assert.strictEqual(number.toLiteral(12345, 16), "0x3039");
        assert.strictEqual(number.toLiteral(12345, number.HEX), "0x3039");
        assert.strictEqual(number.toLiteral(NaN), "NaN");
        assert.strictEqual(number.toLiteral(Infinity), "Infinity");
    });
});