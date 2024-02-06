var cv = { };
cv.controls = { };
cv.net = { };
cv.VERSION = 1.0;

// Global //

trace = function() {
	try {
		console.log.apply(console.log, arguments);
	} catch(e) {
		try {
			firebug.d.console.cmd.log.apply(console.log, arguments);
		} catch(e) {
			alert(arguments[0]);
			return;
		}
	}
}

$ = function(strID) { return document.getElementById(strID); }

// Add XMLHttpRequest if non-existant
if(!window.XMLHttpRequest) {
	XMLHttpRequest = function() {
		//IE8+ only. A more "secure", versatile alternative to IE7's XMLHttpRequest() object.
		// http://msdn.microsoft.com/en-us/library/cc288060(VS.85).aspx
		try{ return new XDomainRequest(); }catch(e){};
		//newer versions of IE6+
		try{ return new ActiveXObject("MSXML3.XMLHTTP"); }catch(e){};
		//newer versions of IE5+
		try{ return new ActiveXObject("MSXML2.XMLHTTP.6.0"); }catch(e){};
		try{ return new ActiveXObject("MSXML2.XMLHTTP.5.0"); }catch(e){};
		try{ return new ActiveXObject("MSXML2.XMLHTTP.4.0"); }catch(e){};
		try{ return new ActiveXObject("MSXML2.XMLHTTP.3.0"); }catch(e){};
		try{ return new ActiveXObject("Msxml2.XMLHTTP"); }catch(e){};
		//older versions of IE5+
		try{ return new ActiveXObject("Microsoft.XMLHTTP"); }catch(e){};
		throw new Error("Could not find an XMLHttpRequest alternative.");
	};
};

// DOM //
cv.DOM = { };

/**
 * Possible values are FF3, FF2, FF, IE, Saf, Chr, Op, or Unknown
 */
cv.DOM.browser = (function x(){})[-5]=='x'?'FF3':(function z(){})[-6]=='z'?'FF2':/a/[-1]=='a'?'FF':'\v'=='v'?'IE':/a/.__proto__=='//'?'Saf':/s/.test(/a/.toString)?'Chr':/^function \(/.test([].sort)?'Op':'Unknown';

cv.DOM.getChildrenByClassName = function(el, className) {
	var l = el.childNodes.length, nL = [], i;
	for(i = 0; i<l; i++) {
		if(el.childNodes[i].className == className) nL.push(el.childNodes[i]);
	}
	return nL;
}

cv.DOM.onReady = function(fn, ctx) {
	var ready, timer, onStateChange, fireDOMReady;
	onStateChange = function(e) {
		//Mozilla & Opera
		if(e && e.type == "DOMContentLoaded") {
			fireDOMReady();
		//Legacy	
		} else if(e && e.type == "load") {
			fireDOMReady();
		//Safari & IE
		} else if(document.readyState) {
			if(document.readyState == "loaded" || document.readyState == "complete") {
				fireDOMReady();
			//IE
			} else if(!!document.documentElement.doScroll) {
				try {
					ready || document.documentElement.doScroll('left');
				} catch(e) {
					return;
				}
				fireDOMReady();
			}
		}
	};
	
	fireDOMReady = function() {
		if(!ready) {
			ready = true;
			//Call the onload function in given context or window object
			fn.call(ctx || window);
			//Clean up after the DOM is ready
			if(document.removeEventListener) document.removeEventListener("DOMContentLoaded", onStateChange, false);
			document.onreadystatechange = null;
			clearInterval(timer);
			timer = null;
		}
	};
	
	//Mozilla & Opera
	if(document.addEventListener) document.addEventListener("DOMContentLoaded", onStateChange, false);
	//IE
	document.onreadystatechange = onStateChange;
	//Safari & IE
	timer = setInterval(onStateChange, 5);
};

// Thanks mootools 1.2.2
// tag : string
// props : object
cv.DOM.createElement = function(tag, props) {
	var a = ['name', 'type', 'checked'], i, el;
	// If IE, handle specific props personally and add to tag
	if (window.ActiveXObject && props) {
		for(i = 0; i < 3; i++) {
			if (!props[a[i]]) return;
			tag += ' ' + a[i] + '="' + props[a[i]] + '"';
			if (a[i] != 'checked') delete props[a[i]];
		}
		tag = '<' + tag + '>';
	}
	// Create element
	el = document.createElement(tag);
	// Set props
	for (i in props) el.setAttribute(i, props[i]);
	return el;
};

// String //
cv.String = { };

// Thanks mootools 1.2.2
cv.String.capitalize = function(str) {
	var f = function(match) {
		return match.toUpperCase();
	}
	return str.replace(/\b[a-z]/g, f);
};

// Thanks mootools 1.2.2
cv.String.fromCharCode = function(code) {
	var keys = {
		num13 : 'enter',
		num38 : 'up',
		num40 : 'down',
		num37 : 'left',
		num39 : 'right',
		num27 : 'esc',
		num32 : 'space',
		num8 : 'backspace',
		num9 : 'tab',
		num46 : 'delete' 
	}, key = keys["num" + code], fKey = code - 111;
	if (fKey > 0 && fKey < 13) key = 'f' + fKey;
	return key || String.fromCharCode(code).toLowerCase();
};

// Thanks mootools 1.2.2
cv.String.hyphenate = function(str) {
	var f = function(match) {
		return ('-' + match.charAt(0).toLowerCase());
	}
	return str.replace(/[A-Z]/g, f);
};

// Thanks mootools 1.2.2
cv.String.camelCase = function(str) {
	var f = function(match) {
		return match.charAt(1).toUpperCase();
	}
	return str.replace(/-\D/g, f);
};

// Styles //
cv.Styles = { };

// Thanks mootools 1.2.2
cv.Styles.get = function(el, prop) {
	if(prop == 'float') prop = (el.style.styleFloat) ? 'styleFloat' : 'cssFloat';
	
	if(prop == 'opacity' && el.currentStyle) {
		return el.style.filter.alpha ? el.style.filter.alpha / 100 : 1;
	}
	
	var result = el.style[prop], value, computed;
	if(!result && result !== 0) {
		if (el.currentStyle) {
			result = el.currentStyle[cv.String.camelCase(prop)];
		} else if (window.getComputedStyle) {
			computed = el.ownerDocument.defaultView.getComputedStyle(el, null);
			result = (computed) ? computed.getPropertyValue(cv.String.hyphenate(prop)) : null;
		}
	}
	
	/*if (result) {
		result = String(result);
		var color = result.match(/rgba?\([\d\s,]+\)/);
		if (color) result = result.replace(color[0], color[0].rgbToHex());
	}*/
	
	if (window.ActiveXObject && !(parseInt(result, 10) || parseInt(result, 10) === 0)) { // Originally had a check for Presto as well - if (Browser.Engine.presto || (Browser.Engine.trident && !$chk(parseInt(result, 10)))){
		if (/^(height|width)$/.test(prop)) {
			value = (prop == 'width') ? ['left', 'right'] : ['top', 'bottom'], size = 0;
			size += parseInt(cv.Styles.get(el, 'border-' + value[0] + '-width')) + parseInt(cv.Styles.get(el, 'padding-' + value[0]));
			size += parseInt(cv.Styles.get(el, 'border-' + value[1] + '-width')) + parseInt(cv.Styles.get(el, 'padding-' + value[1]));
			return el['offset' + cv.String.capitalize(prop)] - size + 'px';
		}
		//if ((Browser.Engine.presto) && String(result).test('px')) return result; // Opera
		if (/(border(.+)Width|margin|padding)/.test(prop)) return '0px';
	}
	
	return result;
}

// Thanks mootools 1.2.2
cv.Styles.set = function(el, prop, value) {
	if(prop == 'float') prop = (el.style.styleFloat) ? 'styleFloat' : 'cssFloat';
	
	if(prop == 'opacity') {
		value = parseFloat(value);
		el.style.visibility = (value == 0) ? 'hidden' : 'visible';
		if (!el.currentStyle || !el.currentStyle.hasLayout) el.style.zoom = 1;
		el.style.filter = (value == 1) ? '' : 'alpha(opacity=' + value * 100 + ')';
		el.style.opacity = value;
		return;
	}
	
	prop = cv.String.camelCase(prop);
	/*
	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++) results[i] = fn.call(bind, this[i], i, this);
		return results;
	},
	
	function $splat(obj){
	var type = $type(obj);
	return (type) ? ((type != 'array' && type != 'arguments') ? [obj] : obj) : [];
};
	
	if ($type(value) != 'string') {
		var map = (Element.Styles.get(property) || '@').split(' ');
		value = $splat(value).map(function(val, i){
			if (!map[i]) return '';
			return ($type(val) == 'number') ? map[i].replace('@', Math.round(val)) : val;
		}).join(' ');
	}*/
	
	el.style[prop] = value;
}

// Events //
cv.Events = { };

cv.Events.addEventListener = function(el, type, fn) {
	if (el.addEventListener) {
		el[type + fn] = function(e) {
			//var e = {};
			//for(var p in evt) e[p] = evt[p]; // Deep copy evt since it's props are read-only
			//e.clientX = e.pageX - window.pageXOffset; // Are read-only props
			//e.clientY = e.pageY - window.pageYOffset; // Are read-only props
			
			while (e.target && e.target.nodeType == 3) e.target = e.target.parentNode;
			if (type.match(/DOMMouseScroll|mousewheel/)) e.scrollDelta = -(e.detail || 0) / 3; // Non W3c
			e.rightClick = (e.which == 3); // Non W3c
			try{
				while (e.relatedTarget && e.relatedTarget.nodeType == 3) e.relatedTarget = e.relatedTarget.parentNode;
			} catch(err) {
				// Give up on 'Permission denied to get property HTMLDivElement.nodeType'
				// See https://bugzilla.mozilla.org/show_bug.cgi?id=208427
			}
			fn(e);
		}
		el.addEventListener(type, el[type + fn], false);
	} else if(el.attachEvent) {
		el[type + fn] = function() {
			var e = window.event;
			e.target = e.srcElement;
			while (e.target && e.target.nodeType == 3) e.target = e.target.parentNode;
			e.which = e.keyCode;
			e.charCode = e.keyCode;
			e.layerX = e.offsetX;
			e.layerY = e.offsetY;
			e.preventDefault = function() { this.returnValue = false; }
			e.stopPropogation = function() { this.cancelBubble = true; }
			e.pageX = e.clientX + document.body.scrollLeft - document.body.clientLeft;
			e.pageY = e.clientY + document.body.scrollTop - document.body.clientTop;
			if (type.match(/DOMMouseScroll|mousewheel/)) e.scrollDelta = e.wheelDelta / 120; // Non W3c
			e.rightClick = (event.button == 2); // Non W3c
			
			if (type.match(/(click|mouse|menu)/i)) {
				e.relatedTarget = null;
				if (type.match(/over|out/)) {
					e.relatedTarget = type == 'onMouseover' ? event.fromElement : event.toElement;
					while (e.relatedTarget && e.relatedTarget.nodeType == 3) e.relatedTarget = e.relatedTarget.parentNode;
				}
			}
			
			fn(e);
		}
		el.attachEvent("on" + type, el[type + fn] );
	} else {
		trace("No addEventListener or attachEvent for: " + el);
	}
}

cv.Events.removeEventListener = function(el, type, fn) {
	if (el.removeEventListener) {
		el.removeEventListener(type, el[type + fn], false);
		el[type + fn] = null;
	} else if(el.detachEvent) {
		el.detachEvent("on" + type, el[type + fn] );
		el[type + fn] = null;
	} else {
		trace("No removeEventListener or detachEvent for: " + el);
	}
}
	
cv.Events.dispatchEvent = function(el, type) {
	var e;
	if(document.createEvent) {
		// dispatch for firefox + others
		e = document.createEvent("HTMLEvents");
		e.initEvent(type, true, true); // event type, bubbling, cancelable
		el.dispatchEvent(e);
	} else {
		// dispatch for IE
		e = document.createEventObject();
		try {
			el.fireEvent("on" + type, e);
		} catch(er) {
			trace("Event: 'on" + type + "' not allowed to be dispatched from " + el.nodeName);
		}
	}
}