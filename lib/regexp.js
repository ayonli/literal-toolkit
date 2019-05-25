"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var strictMatch = require("./util").strictMatch;

var LEADING_SLASH = /^\s*(\/)/;
var EOL = /[\n\r]/;
var FLAGS = "gimsuy";

/**
 * @param {string} str 
 * @returns {{ offset: number, source: string }}
 */
function getSlashedBlock(str) {
    var matches = str.match(LEADING_SLASH);

    if (matches) {
        var offset = str.indexOf(matches[1]),
            index = offset,
            source = matches[1];

        str = str.slice(offset + 1);

        while (-1 !== (index = str.indexOf(matches[1]))) {
            source += str.slice(0, index + 1);

            if (source[source.length - 2] !== "\\") {
                return { offset, source };
            } else {
                str = str.slice(index + 1);
            }
        }
    }

    return null;
}

/**
 * @param {string} str
 * @returns {string} 
 */
function getFlags(str) {
    var flags = "";

    for (let i = 0, len = str.length; i < len; ++i) {
        if (FLAGS.indexOf(str[i]) >= 0 && flags.indexOf(str[i]) === -1) {
            flags += str[i];
        } else {
            break;
        }
    }

    return flags;
}

exports.parseToken = parseToken;
/**
 * 
 * @param {string} str 
 * @returns {{ source: string, offset: number, length: number, value: RegExp }}
 */
function parseToken(str) {
    var block = getSlashedBlock(str);

    if (block && block.source !== "//" && EOL.test(block.source) === false) {
        try {
            var sourceLength = block.source.length;
            var flags = getFlags(str.slice(block.offset + sourceLength));
            var value = new RegExp(block.source.slice(1, -1), flags);
            var token = {
                source: block.source + flags,
                offset: block.offset,
                length: sourceLength + flags.length,
                value: value
            };

            if (strictMatch(str, token)) {
                return token;
            }
        } catch (e) { }
    }

    return null;
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