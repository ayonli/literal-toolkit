"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var strictMatch = require("./util").strictMatch;
var RE_BOOL = /^\s*(true|false)/

/**
 * @param {string} str
 * @returns {{ value: true | false | null | NaN | Infinity, offset: number, length: number }} 
 */
function parseToken(str) {
    var match = RE_BOOL.exec(str);

    if (match) {
        return {
            value: match[1],
            offset: str.indexOf(match[1]),
            length: match[1].length
        }
    } else {
        return { value: undefined, offset: -1, length: 0 }
    }
}