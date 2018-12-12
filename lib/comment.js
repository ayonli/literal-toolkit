"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var INLINE_COMMENT = /^\s*\/\/.*\n*?/
var MULTI_LINE_COMMENT = /^\s*\/\*[\s\S]*?\*\//;

exports.parseToken = parseToken;
/**
 * @param {string} str
 * @returns {{ type: "//" | "/*", value: string, offset: number, length: number }} 
 */
function parseToken(str) {
    var token = { type: "", value: "", offset: 0, length: 0 };
    var match = INLINE_COMMENT.exec(str) || MULTI_LINE_COMMENT.exec(str);

    if (match) {
        token.offset = match[0].indexOf("/");
        token.type = match[0][token.offset + 1] === "/" ? "//" : "/*";
        token.length = match[0].length - token.offset;
        token.value = match[0].slice(token.offset);
    } else {
        return null;
    }
}