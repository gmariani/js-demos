var cv = cv || {};

// Thanks mootools 1.2.3

Array.prototype.toJSON =
    String.prototype.toJSON =
    Number.prototype.toJSON =
        function () {
            return cv.JSON.encode(this);
        };

cv.JSON = {};

//--------------------------------------
//  Public Vars
//--------------------------------------

cv.JSON.VERSION = 1.0;

//--------------------------------------
//  Public Methods
//--------------------------------------

cv.JSON.encode = function (obj) {
    var json,
        results = [],
        key,
        l,
        specialChars = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };

    function replaceChars(chr) {
        return specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
    }

    switch (typeof obj) {
        case 'string':
            return '"' + obj.replace(/[\x00-\x1f\\"]/g, replaceChars) + '"';
        case 'array':
            for (key = 0, l = obj.length; key < l; key++) {
                json = cv.JSON.encode(obj[key]);
                if (json !== undefined) {
                    results.push(json);
                }
            }
            return '[' + String(results) + ']';
        case 'object':
            for (key in obj) {
                json = cv.JSON.encode(obj[key]);
                if (json) {
                    results.push(cv.JSON.encode(key) + ':' + json);
                }
            }
            return '{' + results + '}';
        case 'number':
        case 'boolean':
            return String(obj);
        case false:
            return 'null';
    }
    return null;
};

cv.JSON.decode = function (string, secure) {
    if (typeof string !== 'string' || !string.length) {
        return null;
    }
    if (secure && !/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) {
        return null;
    }
    return eval('(' + string + ')');
};
