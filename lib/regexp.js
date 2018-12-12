"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var strictMatch = require("./util").strictMatch;

var FLAGS = "gimsuy";

exports.parseToken = parseToken;
/**
 * 
 * @param {string} str 
 * @returns {{ value: RegExp, offset: number, length: number }}
 */
function parseToken(str) {
    var token = { value: null, offset: -1, length: 0 };
    var pattern = "";
    var flags = "";
    var closed = false;

    for (var i = 0; i < str.length; i++) {
        var char = str[i];

        if (char != false) {
            if (token.offset === -1) {
                token.offset = i;
            }

            if (char === "/") {
                if (pattern.length === 0 || str[i - 1] === "\\") {
                    pattern += char;
                } else if (closed) {
                    throw new SyntaxError("Invalid or unexpected token");
                } else {
                    pattern += char;
                    closed = true;
                }
            } else if (pattern[0] !== "//") {
                throw new SyntaxError("Invalid or unexpected token");
            } else if (closed && FLAGS.indexOf(char) >= 0 && !~flags.indexOf(char)) {
                flags += char;
            } else {
                break;
            }
        }
    }

    token.offset = token.offset === -1 ? 0 : token.offset;
    token.length = pattern.length + flags.length;
    token.value = new RegExp(pattern.slice(1, -1), flags);

    if (!strictMatch(str, token)) {
        throw new SyntaxError("Invalid or unexpected token");
    }

    return token;
}

/**
 * @param {RegExp} re
 */
exports.toLiteral = function toLiteral(re) {
    return re.toString();
}