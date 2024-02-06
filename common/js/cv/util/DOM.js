var cv = cv || {};

cv.DOM = {};

//--------------------------------------
//  Public Vars
//--------------------------------------

cv.DOM.VERSION = 1.0;

//--------------------------------------
//  Public Methods
//--------------------------------------

/**
 * Possible values are FF3, FF2, FF, IE, Saf, Chr, Op, or Unknown
 */
cv.DOM.browser =
    function x() {}[-5] == 'x'
        ? 'FF3'
        : function z() {}[-6] == 'z'
        ? 'FF2'
        : /a/[-1] == 'a'
        ? 'FF'
        : '\v' == 'v'
        ? 'IE'
        : /a/.__proto__ == '//'
        ? 'Saf'
        : /s/.test(/a/.toString)
        ? 'Chr'
        : /^function \(/.test([].sort)
        ? 'Op'
        : 'Unknown';

cv.DOM.getChildrenByClassName = function (el, className) {
    var l = el.childNodes.length,
        nL = [],
        i;
    for (i = 0; i < l; i++) {
        if (el.childNodes[i].className === className) {
            nL.push(el.childNodes[i]);
        }
    }
    return nL;
};

// Thanks mootools 1.2.2
// tag : string
// props : object
cv.DOM.createElement = function (tag, props) {
    var a = ['name', 'type', 'checked'],
        i,
        el;
    // If IE, handle specific props personally and add to tag
    if (window.ActiveXObject && props) {
        for (i = 0; i < 3; i++) {
            if (!props[a[i]]) {
                return;
            }
            tag += ' ' + a[i] + '="' + props[a[i]] + '"';
            if (a[i] !== 'checked') {
                delete props[a[i]];
            }
        }
        tag = '<' + tag + '>';
    }
    // Create element
    el = document.createElement(tag);
    // Set props
    for (i in props) {
        el.setAttribute(i, props[i]);
    }
    return el;
};

// (IE) The purge function should be called before removing any element,
// either by the removeChild method, or by setting the innerHTML property.
// http://www.crockford.com/javascript/memory/leak.html
cv.DOM.purge = function (el) {
    var a = el.attributes,
        i,
        n;
    if (a) {
        i = a.length;
        while (i--) {
            n = a[i].name;
            if (typeof el[n] === 'function') {
                el[n] = null;
            }
        }
    }
    a = el.childNodes;
    if (a) {
        i = a.length;
        while (i--) {
            cv.purge(el.childNodes[i]);
        }
    }
};
