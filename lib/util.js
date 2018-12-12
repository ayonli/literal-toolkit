// var RE_EMPTY = /^\s*$/;
var RE_BOUNDARY = /^\s*[,;\]}]|^\s*$/;

exports.strictMatch = strictMatch;
/**
 * @param {string} str 
 * @param {{ offset: number, length: number }} token 
 */
function strictMatch(str, token) {
    var leftOver = str.slice(token.offset + token.length);
    return !leftOver || RE_BOUNDARY.test(leftOver);
}