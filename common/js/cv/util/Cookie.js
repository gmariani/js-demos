var cv = cv || {};

cv.Cookie = {};

//--------------------------------------
//  Public Vars
//--------------------------------------

cv.Cookie.VERSION = 1.0;

//--------------------------------------
//  Public Methods
//--------------------------------------

/**
 * Sets a Cookie with the given name and value.
 *
 * name       Name of the cookie
 * value      Value of the cookie
 * [maxAge]   Minutes til cookie expires
 * [path]     Path where the cookie is valid (default: path of calling document)
 * [domain]   Domain where the cookie is valid (default: domain of calling document)
 * [secure]   Boolean value indicating if the cookie transmission requires a secure transmission
 */
cv.Cookie.set = function (name, value, maxAge, path, domain, secure) {
    var age = new Date();
    age.setTime(age.getTime() + maxAge * 60 * 1000);
    document.cookie =
        encodeURIComponent(name) +
        '=' +
        encodeURIComponent(value) +
        (maxAge ? '; max-age=' + age.toUTCString() : '') +
        (path ? '; path=' + path : '') +
        (domain ? '; domain=' + domain : '') +
        (secure ? '; secure' : '');
};

/**
 * Gets the value of the specified cookie.
 *
 * name  Name of the desired cookie.
 *
 * Returns a string containing value of specified cookie,
 *   or null if cookie does not exist.
 */
cv.Cookie.get = function (name) {
    var dc = document.cookie,
        prefix = encodeURIComponent(name) + '=',
        begin = dc.indexOf('; ' + prefix),
        end;

    if (begin === -1) {
        begin = dc.indexOf(prefix);
        if (begin !== 0) {
            return null;
        }
    } else {
        begin += 2;
    }

    end = dc.indexOf(';', begin);
    if (end === -1) {
        end = dc.length;
    }
    return decodeURIComponent(dc.substring(begin + prefix.length, end));
};

/**
 * Deletes the specified cookie.
 *
 * name      name of the cookie
 * [path]    path of the cookie (must be same as path used to create cookie)
 * [domain]  domain of the cookie (must be same as domain used to create cookie)
 */
cv.Cookie.remove = function (name, path, domain) {
    if (cv.getCookie(name)) {
        document.cookie = encodeURIComponent(name) + '=' + (path ? '; path=' + path : '') + (domain ? '; domain=' + domain : '') + '; expires=Thu, 01-Jan-70 00:00:01 GMT';
    }
};
