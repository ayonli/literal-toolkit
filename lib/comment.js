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

/**
 * 
 * @param {string} str 
 * @param {boolean} strip 
 */
exports.parse = function parse(str, strip) {
    var token = parseToken(str);

    if (token) {
        if (!strip) {
            return token.value;
        } else if (token.type === "//") {
            return token.value.replace(/^\/\/\s*/, "");
        } else {
            var lines = token.value.replace(/\s*\*\/$/, "").split("\n");
            lines[0] = lines[0].replace(/^\/\*\s*/, "");

            for (var i = 1; i < lines.length; i++) {
                lines[i] = lines[i].replace(/^\s*\*\s*/, "");
            }

            return lines.join("\n");
        }
    } else {
        return;
    }
};

/**
 * @param {string} str
 * @param {"//" | "/*"}
 */
exports.toLiteral = function toLiteral(str, type) {
    if ((!type || type == "//") && str.indexOf("\n") >= 0) {
        return "// " + str;
    } else {
        var lines = str.split("\n");

        lines[0] = type + " " + lines[0];

        for (var i = 1; i < lines.length; i++) {
            lines[i] = " * " + lines[i];
        }

        lines[lines.length - 1] += " */";

        return lines.join("\n");
    }
};