"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var strictMatch = require("./util").strictMatch;
var keyword = require("./keyword");

var NUM_SEQUENCE = "0123456789abcdefox-+.";

exports.BIN = 2;
exports.OCT = 8;
exports.DEC = 10;
exports.HEX = 16;

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
    var _token = keyword.parseToken(str);

    if (_token) {
        token = Object.assign(_token, { radix: 10 });

        if (typeof token.value !== "number") {
            return null;
        }

        return token;
    }

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
                if ((matches.length === 1 && matches[0] === "0") || (
                    matches.length === 2 && matches[1] === "0" && (
                        matches[0] === "-" || matches[0] === "+"
                    )
                )) {
                    token.radix = ({ b: 2, o: 8, x: 16 })[_char];
                    matches += char;
                } else if (_char === "b" && token.radix === 16) {
                    matches += char;
                } else {
                    break;
                }
            } else if (pos < 8) {
                if (matches.length === 0 || (
                    matches.length === 1 && (
                        matches[0] === "-" || matches[0] === "+"
                    )
                )) {
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
            } else if (char === ".") {
                if (matches.length === 0) {
                    token.radix = 10;
                    matches += char;
                } else if (token.radix === 10 && matches.indexOf(".") === -1) {
                    matches += char;
                } else {
                    break;
                }
            } else { // -+
                var prevChar = str[i - 1];
                if (matches.length === 0 || ( // signed number
                    prevChar === "e" || prevChar === "E" // scientific notation
                )) {
                    matches += char;
                } else {
                    break;
                }
            }
        }
    }

    token.source = matches;
    token.length = matches.length;
    token.offset = token.offset === -1 ? 0 : token.offset;

    if (matches) {
        if (token.radix === 8 && /[oO]/.test(matches) === false) {
            token.value = parseInt(matches, 8);
        } else if (token.radix !== 10) {
            if (matches[0] === "-") {
                token.value = -Number(matches.slice(1));
            } else if (matches[0] === "+") {
                token.value = Number(matches.slice(1));
            } else {
                token.value = Number(matches);
            }
        } else {
            token.value = Number(matches);
        }
    }

    var boundaries = token.radix === 10 ? /^\s*[,;:)\]}]|^\s*$/ : undefined;

    if (isNaN(token.value) || (
        !allowTrailings && !strictMatch(str, token, boundaries)
    )) {
        return null;
    }

    return token;
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
 * @param {number} num
 * @param {2 | 8 | 10 | 16} radix
 */
exports.toLiteral = function toLiteral(num, radix) {
    if (Number.isNaN(num) || num === Infinity) {
        return keyword.toLiteral(num);
    } else {
        radix = radix || 10;
        return ({ 2: "0b", 8: "0o", 10: "", 16: "0x" })[radix] + num.toString(radix);
    }
};