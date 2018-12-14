var BOUNDARIES = /^\s*[,;)\]}]|^\s*$/;

exports.strictMatch = strictMatch;
/**
 * @param {string} str 
 * @param {{ offset: number, length: number }} token 
 */
function strictMatch(str, token) {
    var boundaries = arguments[2] || BOUNDARIES;
    var leftOver = str.slice(token.offset + token.length);
    return !leftOver || boundaries.test(leftOver);
}