"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var KEYWORDS = /^\s*(true|false|null|NaN|Infinity)(\s*[,;)\]}]|\s*$)/;

exports.parseToken = parseToken;
/**
 * @param {string} str
 * @returns {{ source: string, offset: number, length: number, value: true | false | null | NaN | Infinity }} 
 */
function parseToken(str) {
    var match = KEYWORDS.exec(str);

    if (match) {
        var value;

        switch (match[1]) {
            case "true":
                value = true;
                break;
            case "false":
                value = false;
                break;
            case "NaN":
            case "Infinity":
                value = Number(match[1]);
                break;
            default:
                value = null;
                break;
        }

        return {
            source: match[1],
            offset: str.indexOf(match[1]),
            length: match[1].length,
            value: value
        };
    } else {
        return null;
    }
}

/**
 * @param {string} str 
 */
exports.parse = function parse(str) {
    var token = parseToken(str);
    return token ? token.value : undefined;
};

/**
 * @param {true | false | null | NaN | Infinity} keyword
 */
exports.toLiteral = function toLiteral(keyword) {
    return String(keyword);
};