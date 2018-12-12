"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var RE_BOOL = /^\s*(true|false|null|NaN|Infinity)(\s*[,;\]}]|\s*$)/;

exports.parseToken = parseToken;
/**
 * @param {string} str
 * @returns {{ value: true | false | null | NaN | Infinity, offset: number, length: number }} 
 */
function parseToken(str) {
    var match = RE_BOOL.exec(str);

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
            value: value,
            offset: str.indexOf(match[1]),
            length: match[1].length
        };
    } else {
        return { value: undefined, offset: 0, length: 0 };
    }
}

/**
 * @param {string} str 
 */
exports.parse = function parse(str) {
    return parseToken(str).value;
};

exports.toLiteral = function toLiteral(value) {
    return String(value);
};