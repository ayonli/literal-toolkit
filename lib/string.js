"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var strictMatch = require("./util").strictMatch;
var escape = exports.escape = require("safe-string-literal").escape;
var unescape = exports.unescape = require("safe-string-literal").unescape;

var SINGLE_QUOTE = exports.SINGLE_QUOTE = "'";
var DOUBLE_QUOTE = exports.DOUBLE_QUOTE = '"';
var BACK_QUOTE = exports.BACK_QUOTE = "`";

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
    var token = { source: "", offset: -1, length: 0, value: "", quote: "" };
    var matches = "";
    var skippedLength = 0;
    var closed = false;

    for (var i = 0; i < str.length; i++) {
        var char = str[i];

        if (char != false || token.quote) {
            if (token.offset === -1) {
                token.offset = i;
            }

            token.source += char;

            if (char === SINGLE_QUOTE || char === DOUBLE_QUOTE || char === BACK_QUOTE) {
                matches += char;

                if (!token.quote) {
                    token.quote = char;
                } else if (char === token.quote && str[i - 1] !== "\\") {
                    closed = true;
                    break;
                }
            } else if (char === "\\") {
                if (str[i + 1] === "\n") {
                    token.source += "\n";
                    skippedLength += 2;
                    i++; // skip new line character of the string
                } else {
                    matches += char;
                }
            } else if (char === "\n") {
                if (token.quote === BACK_QUOTE) {
                    matches += char;
                } else if (str[i - 1] !== "\\") {
                    return null;
                } else {
                    matches = matches.slice(0, -1);
                    matches += char;
                }
            } else if (char !== "\n" && token.quote) {
                matches += char;
            } else {
                return null;
            }
        }
    }

    if (!closed) return null;

    token.value = matches && unescape(removeUnusedEscapes(matches.slice(1, -1)));
    token.length = matches.length + skippedLength;
    token.offset = token.offset === -1 ? 0 : token.offset;

    if (strictMatch(str, token, /^\s*[,;:)\]}\/]|^\s*$/)) {
        return token;
    } else {
        return null;
    }
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