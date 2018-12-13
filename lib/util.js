// var RE_EMPTY = /^\s*$/;
var BOUNDARIES = /^\s*[,;\]}]|^\s*$/;

exports.strictMatch = strictMatch;
/**
 * @param {string} str 
 * @param {{ offset: number, length: number }} token 
 */
function strictMatch(str, token) {
    var leftOver = str.slice(token.offset + token.length);
    return !leftOver || BOUNDARIES.test(leftOver);
}