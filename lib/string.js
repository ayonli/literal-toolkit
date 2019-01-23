"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var strictMatch = require("./util").strictMatch;
var escape = exports.escape = require("safe-string-literal").escape;
var unescape = exports.unescape = require("safe-string-literal").unescape;

exports.SINGLE_QUOTE = "'";
exports.DOUBLE_QUOTE = '"';
exports.BACK_QUOTE = "`";

var LEADING_QUOTES = /^\s*("|'|`)/;
var BOUNDARIES = /^\s*[,;:)\]}\/]|^\s*$/;

/**
 * @param {string} str 
 * @returns {{ quote: string, offset: number, source: string }}
 */
function getQuotedBlock(str) {
    var matches = str.match(LEADING_QUOTES);

    if (matches) {
        var quote = matches[1],
            offset = str.indexOf(quote),
            index = offset,
            source = quote;

        str = str.slice(offset + 1);

        while (-1 !== (index = str.indexOf(quote))) {
            source += str.slice(0, index + 1);

            if (source[source.length - 2] !== "\\") {
                return { quote, offset, source };
            } else {
                str = str.slice(index + 1);
            }
        }
    }

    return null;
}

/**
 * @param {string} str 
 */
function removeUnusedEscapes(str) {
    var exludes = "\\'\"`bfnrtux";
    return String(str).replace(/\\\S/g, function (chars) {
        if (!~exludes.indexOf(chars[1])) {
            return chars[1];
        } else {
            return chars;
        }
    });
}

exports.parseToken = parseToken;
/**
 * @param {string} str
 * @returns {{ source: string, offset: number, length: number, value: string, quote: "'" | "\"" | "`" }} 
 */
function parseToken(str) {
    var block = getQuotedBlock(str);

    if (block) {
        var token = Object.assign(block, {
            length: block.source.length,
            value: void 0
        });
        var lines = token.source.slice(1, -1).split("\n");

        if (lines.length === 1) {
            token.value = unescape(removeUnusedEscapes(lines[0]));
        } else {
            for (var i = lines.length - 1; i--;) {
                if (lines[i][lines[i].length - 1] === "\\") {
                    lines[i] = lines[i].slice(0, -1);
                } else if (token.quote === "`") {
                    lines[i] += "\n";
                } else {
                    return null; // invalid new line
                }
            }

            token.value = unescape(removeUnusedEscapes(lines.join("")));
        }

        if (strictMatch(str, token, BOUNDARIES)) {
            return token;
        }
    }

    return null;
}

exports.parse = parse;
/**
 * @param {string} str 
 */
function parse(str) {
    var token = parseToken(str);
    return token ? token.value : undefined;
}

exports.toLiteral = toLiteral;
/**
 * @param {string} str 
 * @param {"'" | "\"" | "`"} quote 
 */
function toLiteral(str, quote) {
    var exclues;
    quote = quote || '"';

    if (quote === "'")
        exclues = '"`';
    else if (quote === '"')
        exclues = "'`";
    else if (quote === "`")
        exclues = "'\"\n";

    return quote + escape(str, exclues) + quote;
}