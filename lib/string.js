"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var strictMatch = require("./util").strictMatch;
var escape = exports.escape = require("safe-string-literal").escape;
var unescape = exports.unescape = require("safe-string-literal").unescape;

var SINGLE_QUOTE = exports.SINGLE_QUOTE = "'";
var DOUBLE_QUOTE = exports.DOUBLE_QUOTE = '"';
var BACK_QUOTE = exports.BACK_QUOTE = "`";

exports.parseToken = parseToken;
/**
 * @param {string} str
 * @returns {{ quote: "'" | "\"" | "`", value: string, offset: number, length: number }} 
 */
function parseToken(str) {
    var token = { quote: "", value: "", offset: -1, length: 0 };
    var matches = "";
    var skippedLength = 0;

    for (var i = 0; i < str.length; i++) {
        var char = str[i];

        if (char != false || token.quote) {
            if (token.offset === -1) {
                token.offset = i;
            }

            if (char === SINGLE_QUOTE || char === DOUBLE_QUOTE || char === BACK_QUOTE) {
                matches += char;

                if (!token.quote) {
                    token.quote = char;
                } else if (char === token.quote && str[i - 1] !== "\\") {
                    break;
                }
            } else if (char === "\\") {
                if (str[i + 1] === "\n") {
                    skippedLength += 2;
                    i++; // skip new line character of the string
                } else {
                    matches += char;
                }
            } else if (char === "\n") {
                if (token.quote === BACK_QUOTE) {
                    matches += char;
                } else if (str[i - 1] !== "\\") {
                    throw new SyntaxError("Invalid or unexpected token");
                } else {
                    matches = matches.slice(0, -1);
                    matches += char;
                }
            } else if (char !== "\n" && token.quote) {
                matches += char;
            } else {
                throw new SyntaxError("Invalid or unexpected token");
            }
        }
    }

    token.value = matches && unescape(matches.slice(1, -1)).replace(/\\/g, "");
    token.length = matches.length + skippedLength;
    token.offset = token.offset === -1 ? 0 : token.offset;

    if (strictMatch(str, token)) {
        return token;
    } else {
        throw new SyntaxError("Invalid or unexpected token");
    }
}

exports.parse = parse;
/**
 * @param {string} str 
 * @param {boolean} strict
 */
function parse(str) {
    return parseToken(str).value;
}

exports.toLiteral = toLiteral;
/**
 * @param {string} str 
 * @param {"'" | "\"" | "`"} quote 
 */
function toLiteral(str, quote) {
    var exclues;

    if (quote === "'")
        exclues = '"`';
    else if (quote === '"')
        exclues = "'`";
    else if (quote === "`")
        exclues = "'\"\n";

    return quote + escape(str, exclues) + quote;
}