"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var strictMatch = require("./util").strictMatch;

var NUM_SEQUENCE = "0123456789abcdefinox-+.";
var BOUNDARIES = /^\s*[,;:)\]}\/]|^\s*$/;

exports.BIN = 2;
exports.OCT = 8;
exports.DEC = 10;
exports.HEX = 16;

function isHead(matches, char) {
    char = char || "";
    return matches === char || matches === "+" + char || matches === "-" + char;
}

exports.parseToken = parseToken;
/**
 * @param {string} str
 * @param {boolean} allowTrailings
 * @returns {{ source: string, offset: number, length: number, value: number, radix: 8 | 10 | 16 }} 
 */
function parseToken(str) {
    var allowTrailings = arguments[1] || false;
    var matches = "";
    var token = { source: "", offset: -1, length: 0, value: NaN, radix: 0 };

    for (var i = 0; i < str.length; i++) {
        var char = str[i];

        if (char != false || char === "0") {
            if (token.offset === -1) {
                token.offset = i;
            }

            var _char = char.toLowerCase();
            var pos = NUM_SEQUENCE.indexOf(_char);

            if (pos === -1) {
                break;
            } else if (_char === "e") {
                if (token.radix === 16 || (
                    token.radix === 10 && matches.indexOf(char) === -1)
                ) {
                    matches += char;
                } else {
                    break;
                }
            } else if (_char === "b" || _char === "o" || _char === "x") {
                if (isHead(matches, "0")) {
                    token.radix = ({ b: 2, o: 8, x: 16 })[_char];
                    matches += char;
                } else if (_char === "b" && token.radix === 16) {
                    matches += char;
                } else {
                    break;
                }
            } else if (pos < 8) {
                if (isHead(matches)) {
                    if (char === "0") {
                        token.radix = 8;
                    } else {
                        token.radix = 10;
                    }
                }
                matches += char;
            } else if (pos < 10) {
                if (token.radix === 2 || token.radix === 8) {
                    token.radix = 10;
                }
                matches += char;
            } else if (pos < 16) {
                if (token.radix === 16) {
                    matches += char;
                } else {
                    break;
                }
            } else if (char === "n") {
                if (token.radix === 10 && matches.indexOf(".") === -1) {
                    matches += char;
                    break;
                } else {
                    break;
                }
            } else if (char === ".") {
                if (isHead(matches)) {
                    token.radix = 10;
                    matches += char;
                } else if (token.radix === 10 && matches.indexOf(".") === -1) {
                    matches += char;
                } else {
                    break;
                }
            } else if (isHead(char)) { // -+
                if (matches === "" || ( // signed number
                    str[i - 1] === "e" || str[i - 1] === "E" // scientific notation
                )) {
                    matches += char;
                } else {
                    break;
                }
            } else {
                if (isHead(matches)) {
                    if (str.slice(i, i + 3) === "NaN") {
                        matches += "NaN";
                    } else if (str.slice(i, i + 8) === "Infinity") {
                        matches += "Infinity";
                    } else {
                        return null;
                    }
                }
                break;
            }
        }
    }

    token.source = matches;
    token.length = matches.length;
    token.offset = token.offset === -1 ? 0 : token.offset;
    token.radix = token.radix || 10;

    if (matches) {
        if (token.radix === 8 && /[Oo]/.test(matches) === false) {
            token.value = parseInt(matches, 8);
        } else if (token.radix !== 10) {
            if (matches[0] === "-") {
                token.value = -Number(matches.slice(1));
            } else if (matches[0] === "+") {
                token.value = Number(matches.slice(1));
            } else {
                token.value = Number(matches);
            }
        } else if (matches[matches.length - 1] === "n") {
            if (typeof BigInt === "function") {
                token.value = BigInt(matches.slice(0, -1));
            } else {
                return null;
            }
        } else {
            token.value = Number(matches);
        }
    }

    if (!allowTrailings && !strictMatch(str, token, BOUNDARIES)) {
        return null;
    } else {
        return token;
    }
}

exports.parse = parse;
/**
 * @param {string} str 
 * @param {boolean} strict 
 */
function parse(str, strict) {
    var token = parseToken(str, !strict);
    return token ? token.value : undefined;
}

function isRadix(str, radix) {
    var token = parseToken(str);
    return token ? token.radix == radix : false;
}

/**
 * @param {string} str 
 */
exports.isBin = function isBin(str) {
    return isRadix(str, 2);
};

/**
 * @param {string} str 
 */
exports.isOct = function isOct(str) {
    return isRadix(str, 8);
};

/**
 * @param {string} str 
 */
exports.isDec = function isDec(str) {
    return isRadix(str, 10);
};

/**
 * @param {string} str 
 */
exports.isHex = function isHex(str) {
    return isRadix(str, 16);
};

/**
 * @param {string} str 
 */
exports.isNaN = function isNaN(str) {
    var value = parse(str, true);
    return value === undefined || Number.isNaN(value);
};

/**
 * @param {string} str 
 */
exports.isFinite = function isFinite(str) {
    return Number.isFinite(parse(str, true));
};

/**
 * @param {string} str
 */
exports.isBigInt = function isBigInt(str) {
    return typeof parse(str, true) === "bigint";
};

/**
 * @param {number | bigint} num
 * @param {2 | 8 | 10 | 16} radix
 */
exports.toLiteral = function toLiteral(num, radix) {
    radix = radix || 10;

    let head = ({ 2: "0b", 8: "0o", 10: "", 16: "0x" })[radix];
    let str = num.toString(radix) + (typeof num === "bigint" ? "n" : "");

    return str[0] === "-" ? ("-" + head + str.slice(1)) : (head + str);
};