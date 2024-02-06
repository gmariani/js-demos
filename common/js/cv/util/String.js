var cv = cv || {};

cv.String = {};

//--------------------------------------
//  Public Vars
//--------------------------------------

cv.String.VERSION = 1.0;

//--------------------------------------
//  Public Methods
//--------------------------------------

// Thanks mootools 1.2.2
cv.String.capitalize = function (str) {
    var f = function (match) {
        return match.toUpperCase();
    };
    return str.replace(/\b[a-z]/g, f);
};

// Thanks mootools 1.2.2
cv.String.fromCharCode = function (code) {
    var keys = {
            num13: 'enter',
            num38: 'up',
            num40: 'down',
            num37: 'left',
            num39: 'right',
            num27: 'esc',
            num32: 'space',
            num8: 'backspace',
            num9: 'tab',
            num46: 'delete',
        },
        key = keys['num' + code],
        fKey = code - 111;
    if (fKey > 0 && fKey < 13) {
        key = 'f' + fKey;
    }
    return key || String.fromCharCode(code).toLowerCase();
};

// Thanks mootools 1.2.2
cv.String.hyphenate = function (str) {
    var f = function (match) {
        return '-' + match.charAt(0).toLowerCase();
    };
    return str.replace(/[A-Z]/g, f);
};

// Thanks mootools 1.2.2
cv.String.camelCase = function (str) {
    var f = function (match) {
        return match.charAt(1).toUpperCase();
    };
    return str.replace(/-\D/g, f);
};
