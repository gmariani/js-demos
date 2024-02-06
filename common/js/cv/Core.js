/*
Script: Core.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2008 [Valerio Proietti](http://mad4milk.net/).

Code & Documentation:
	[The MooTools production team](http://mootools.net/developers/).

Inspiration:
	- Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
	- Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)
*/

var cv = {
        version: '1.1.0',
    },
    trace = function () {
        try {
            console.log.apply(console.log, arguments);
        } catch (e) {
            try {
                firebug.d.console.cmd.log.apply(console.log, arguments);
            } catch (e2) {
                var str = '',
                    i;
                for (i in arguments) {
                    str += ' ' + arguments[i];
                }
                alert(str);
            }
        }
    },
    $ = function (strID) {
        return document.getElementById(strID);
    };

// Add XMLHttpRequest if non-existant
if (!window.XMLHttpRequest) {
    XMLHttpRequest = function () {
        // IE8+ only. A more "secure", versatile alternative to IE7's XMLHttpRequest() object.
        // http://msdn.microsoft.com/en-us/library/cc288060(VS.85).aspx
        try {
            return new XDomainRequest();
        } catch (e) {}
        //newer versions of IE6+
        try {
            return new ActiveXObject('MSXML3.XMLHTTP');
        } catch (e) {}
        //newer versions of IE5+
        try {
            return new ActiveXObject('MSXML2.XMLHTTP.6.0');
        } catch (e) {}
        try {
            return new ActiveXObject('MSXML2.XMLHTTP.5.0');
        } catch (e) {}
        try {
            return new ActiveXObject('MSXML2.XMLHTTP.4.0');
        } catch (e) {}
        try {
            return new ActiveXObject('MSXML2.XMLHTTP.3.0');
        } catch (e) {}
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {}
        //older versions of IE5+
        try {
            return new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {}
        throw new Error('Could not find an XMLHttpRequest alternative.');
    };
}

/*
Script: Event.js
	Handles cross-browser event handling

License:
	MIT-style license.
*/

// scrollDelta instead of wheelDelta
// client object contains adjusted FireFox client props
cv.addEventListener = function (el, type, fn) {
    if (el.addEventListener) {
        el[type + fn] = function (e) {
            // Can't wrap native functions (i.e. preventDefault), errors
            /*var e = {};
			for(var p in evt) {
				e[p] = evt[p]; // Deep copy evt since it's props are read-only
			}
			e.clientX = e.pageX - window.pageXOffset; // Are read-only props
			e.clientY = e.pageY - window.pageYOffset; // Are read-only props
			*/

            if (e.clientX && e.clientY) {
                e.client = { x: e.pageX - window.pageXOffset, y: e.pageY - window.pageYOffset };
            }

            if (e.pageX && e.pageY) {
                e.page = { x: e.pageX, y: e.pageY };
            } // Just for completeness' sake

            if (e.layerX && e.layerY) {
                e.layer = { x: e.layerX, y: e.layerY };
            } // Just for completeness' sake

            if (e.screenX && e.screenY) {
                e.screen = { x: e.screenX, y: e.screenY };
            } // Just for completeness' sake

            while (e.target && e.target.nodeType === 3) {
                e.target = e.target.parentNode;
            }

            if (type.match(/DOMMouseScroll|mousewheel/)) {
                e.scrollDelta = -(e.detail || 0) / 3;
            } // Non W3c

            if (e.which) {
                e.rightClick = e.which === 3;
            } // Non W3C

            // Give up on 'Permission denied to get property HTMLDivElement.nodeType'
            // See https://bugzilla.mozilla.org/show_bug.cgi?id=208427
            try {
                while (e.relatedTarget && e.relatedTarget.nodeType === 3) {
                    e.relatedTarget = e.relatedTarget.parentNode;
                }
            } catch (err) {}

            fn(e);
        };
        el.addEventListener(type, el[type + fn], false);
    } else if (el.attachEvent) {
        el[type + fn] = function () {
            var e = window.event;
            e.target = e.srcElement;
            while (e.target && e.target.nodeType === 3) {
                e.target = e.target.parentNode;
            }
            e.which = e.keyCode;
            e.charCode = e.keyCode;

            e.layerX = e.offsetX;
            e.layerY = e.offsetY;
            e.layer = { x: e.layerX, y: e.layerY };

            e.preventDefault = function () {
                this.returnValue = false;
            };
            e.stopPropagation = function () {
                this.cancelBubble = true;
            };

            if (e.clientX && e.clientY) {
                e.client = { x: e.clientX, y: e.clientY };
            }

            if (e.screenX && e.screenY) {
                e.screen = { x: e.screenX, y: e.screenY };
            }

            e.pageX = e.clientX + document.body.scrollLeft - document.body.clientLeft;
            e.pageY = e.clientY + document.body.scrollTop - document.body.clientTop;
            e.page = { x: e.pageX, y: e.pageY };

            if (type.match(/DOMMouseScroll|mousewheel/)) {
                e.scrollDelta = e.wheelDelta / 120;
            } // Non W3c

            e.rightClick = e.button === 2; // Non W3c

            if (type.match(/(click|mouse|menu)/i)) {
                e.relatedTarget = null;
                if (type.match(/over|out/)) {
                    e.relatedTarget = type === 'onMouseover' ? e.fromElement : e.toElement;
                    while (e.relatedTarget && e.relatedTarget.nodeType === 3) {
                        e.relatedTarget = e.relatedTarget.parentNode;
                    }
                }
            }

            fn(e);
        };
        el.attachEvent('on' + type, el[type + fn]);
    } else {
        trace('No addEventListener or attachEvent for: ' + el);
    }
};

cv.removeEventListener = function (el, type, fn) {
    if (el.removeEventListener) {
        el.removeEventListener(type, el[type + fn], false);
        el[type + fn] = null;
    } else if (el.detachEvent) {
        el.detachEvent('on' + type, el[type + fn]);
        el[type + fn] = null;
    } else {
        trace('No removeEventListener or detachEvent for: ' + el);
    }
};

/*
Bubbling and cancelable are both enabled as you can't change this for IE

el : Element to dispatch from
type : Event type
object[optional] : What event object to dispatch. can be: HTMLEvents, MouseEvents, UIEvents, etc...
*/
cv.dispatchEvent = function (el, type, object) {
    var e;
    if (document.createEvent) {
        // dispatch for firefox + others
        e = document.createEvent(object || 'HTMLEvents');
        e.initEvent(type, true, true); // event type, bubbling, cancelable
        el.dispatchEvent(e);
    } else {
        // dispatch for IE
        e = document.createEventObject();
        try {
            el.fireEvent('on' + type, e);
        } catch (err) {
            trace("Event: 'on" + type + "' not allowed to be dispatched from " + el.nodeName);
        }
    }
};

/*
Script: Property.js
	Handles cross-browser properties/attributes

	Thanks MooTools 1.2.3

License:
	MIT-style license.
*/

(function () {
    function associate(arr, keys, lowerCase) {
        var obj = {},
            l = Math.min(arr.length, keys.length),
            i;
        for (i = 0; i < l; i++) {
            obj[lowerCase ? keys[i].toLowerCase() : keys[i]] = arr[i];
        }
        return obj;
    }

    function extend(orig, ext) {
        for (var key in ext) {
            orig[key] = ext[key];
        }
    }

    var attributes = {
            html: 'innerHTML',
            class: 'className',
            for: 'htmlFor',
            defaultValue: 'defaultValue',
            text: window.ActiveXObject ? 'innerText' : 'textContent' /* Browser.Engine.webkit && Browser.Engine.version < 420 is innerText */,
        },
        bools = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readonly', 'multiple', 'selected', 'noresize', 'defer'],
        camels = ['value', 'type', 'defaultValue', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap'];
    bools = associate(bools, bools, false);
    camels = associate(camels, camels, true);
    extend(attributes, bools);
    extend(attributes, camels);

    cv.getProperty = function (el, attr) {
        var key = attributes[attr],
            value = key ? el[key] : el.getAttribute(attr, 2);
        return bools[attr] ? !!value : key ? value : value || null;
    };

    cv.setProperty = function (el, attr, value) {
        var key = attributes[attr];
        if (value === undefined) {
            return el.removeProperty(attr);
        }
        if (key && bools[attr]) {
            value = !!value;
        }
        if (key) {
            el[key] = value;
        } else {
            el.setAttribute(attr, '' + value);
        }
        return el;
    };

    cv.removeProperty = function (el, attr) {
        var key = attributes[attr];
        if (key) {
            el[key] = key && bools[attr] ? false : '';
        } else {
            el.removeAttribute(attr);
        }
        return el;
    };
})();

/*
Script: Style.js
	Handles cross-browser styles

	Requires : cv.String

	Thanks MooTools 1.2.2

License:
	MIT-style license.
*/

cv.getStyle = function (el, prop) {
    if (prop === 'float') {
        prop = el.style.styleFloat ? 'styleFloat' : 'cssFloat';
    }

    if (prop === 'opacity' && el.currentStyle) {
        return el.style.filter.alpha ? el.style.filter.alpha / 100 : 1;
    }

    var result = el.style[prop],
        value,
        computed,
        size = 0;
    if (!result && result !== 0) {
        if (el.currentStyle) {
            result = el.currentStyle[cv.String.camelCase(prop)];
        } else if (window.getComputedStyle) {
            computed = el.ownerDocument.defaultView.getComputedStyle(el, null);
            result = computed ? computed.getPropertyValue(cv.String.hyphenate(prop)) : null;
        }
    }

    /*if (result) {
		result = String(result);
		var color = result.match(/rgba?\([\d\s,]+\)/);
		if (color) result = result.replace(color[0], color[0].rgbToHex());
	}*/

    if (window.ActiveXObject && !(parseInt(result, 10) || parseInt(result, 10) === 0)) {
        // Originally had a check for Presto as well - if (Browser.Engine.presto || (Browser.Engine.trident && !$chk(parseInt(result, 10)))){
        if (/^(height|width)$/.test(prop)) {
            value = prop === 'width' ? ['left', 'right'] : ['top', 'bottom'];
            size += parseInt(cv.getStyle(el, 'border-' + value[0] + '-width'), 10) + parseInt(cv.getStyle(el, 'padding-' + value[0]), 10);
            size += parseInt(cv.getStyle(el, 'border-' + value[1] + '-width'), 10) + parseInt(cv.getStyle(el, 'padding-' + value[1]), 10);
            return el['offset' + cv.String.capitalize(prop)] - size + 'px';
        }
        //if ((Browser.Engine.presto) && String(result).test('px')) return result; // Opera
        if (/(border(.+)Width|margin|padding)/.test(prop)) {
            return '0px';
        }
    }

    return result;
};

cv.setStyle = function (el, prop, value) {
    if (prop === 'float') {
        prop = el.style.styleFloat ? 'styleFloat' : 'cssFloat';
    }

    if (prop === 'opacity') {
        value = parseFloat(value);
        el.style.visibility = value === 0 ? 'hidden' : 'visible';
        if (!el.currentStyle || !el.currentStyle.hasLayout) {
            el.style.zoom = 1;
        }
        el.style.filter = value === 1 ? '' : 'alpha(opacity=' + value * 100 + ')';
        el.style.opacity = value;
        return;
    }

    prop = cv.String.camelCase(prop);
    el.style[prop] = value;
};
