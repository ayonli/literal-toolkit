"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var strictMatch = require("./util").strictMatch;

var FLAGS = "gimsuy";

exports.parseToken = parseToken;
/**
 * 
 * @param {string} str 
 * @returns {{ source: string, offset: number, length: number, value: RegExp }}
 */
function parseToken(str) {
    var token = { value: null, offset: -1, length: 0 };
    var source = "";
    var flags = "";
    var closed = false;

    for (var i = 0; i < str.length; i++) {
        var char = str[i];

        if (char != false) {
            if (token.offset === -1) {
                token.offset = i;
            }

            if (char === "/") {
                if (source.length === 0 || str[i - 1] === "\\") {
                    source += char;
                } else if (closed) {
                    return null;
                } else {
                    source += char;
                    closed = true;
                }
            } else if (source[0] !== "/") {
                return null;
            } else if (closed && FLAGS.indexOf(char) >= 0 && !~flags.indexOf(char)) {
                flags += char;
            } else if (!closed) {
                source += char;
            } else {
                break;
            }
        }
    }

    token.source = source + flags;
    token.offset = token.offset === -1 ? 0 : token.offset;
    token.length = source.length + flags.length;

    try {
        token.value = new RegExp(source.slice(1, -1), flags);
    } catch (e) {
        return null;
    }

    if (!strictMatch(str, token)) {
        return null;
    }

    return token;
}

/**
 * @param {string} str
 */
exports.parse = function parse(str) {
    var token = parseToken(str);
    return token ? token.value : undefined;
};

/**
 * @param {RegExp} re
 */
exports.toLiteral = function toLiteral(re) {
    return String(re);
}