"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var INLINE_COMMENT = /^\s*\/\/.*\n*?/;
var MULTI_LINE_COMMENT = /^\s*\/\*[\s\S]*?\*\//;

exports.parseToken = parseToken;
/**
 * @param {string} str
 * @returns {{ source: string, offset: number, length: number, value: string, type: "//" | "/*" | "/**" }} 
 */
function parseToken(str) {
    var token = { source: "", offset: 0, length: 0, value: "", type: "" };
    var match = INLINE_COMMENT.exec(str) || MULTI_LINE_COMMENT.exec(str);

    if (match) {
        token.offset = match[0].indexOf("/");
        token.length = match[0].length - token.offset;
        token.source = token.value = match[0].slice(token.offset);

        if (token.value[1] === "/") {
            token.type = "//";
        } else if (token.value.slice(1, 3) === "**") {
            token.type = "/**"
        } else {
            token.type = "/*";
        }

        return token;
    } else {
        return null;
    }
}

/**
 * 
 * @param {string} str 
 * @param {boolean} strip Strip meaningless characters.
 */
exports.parse = function parse(str, strip) {
    var token = parseToken(str);

    if (!token) return;

    if (!strip) {
        return token.value;
    } else if (token.type === "//") {
        return token.value.replace(/^\/\/\s*/, "");
    } else {
        var lines = token.value.replace(/\s*\*\/$/, "").split("\n");
        var value = lines[0].replace(/^\/\*\s*/, "");
        var isNewLine = false;

        for (var i = 1; i < lines.length; i++) {
            if (/^[\s\*]*$/.test(lines[i])) {
                if (!isNewLine) {
                    value += "\n";
                    isNewLine = true;
                }
            } else {
                value += (isNewLine ? "" : " ") + lines[i].replace(/^[\s\*]*/, "");
                isNewLine = false;
            }
        }

        return value;
    }
};

/**
 * @param {string} str
 * @param {"//" | "/*" | "/**"} type
 * @param {string} indent Indent all rest lines of the comment with the given spaces.
 */
exports.toLiteral = function toLiteral(str, type, indent) {
    type = type || "//";
    indent = indent || "";

    var hasMultiLine = str.indexOf("\n") >= 0;

    if (!hasMultiLine) {
        if (type === "//") {
            return "// " + str;
        } else {
            return type + " " + str + " */";
        }
    } else {
        var lines = str.split("\n");

        if (type === "//") {
            lines[0] = "// " + lines[0];
        } else {
            lines.unshift(type);
        }

        for (var i = 1; i < lines.length; i++) {
            lines[i] = lines[i].replace(/^\s*/, "");

            if (type == "//") {
                lines[i] = indent + "// " + lines[i];
            } else {
                lines[i] = indent + " * " + lines[i];
            }
        }

        if (type !== "//") {
            lines.push(indent + " */");
        }

        return lines.join("\n");
    }
};