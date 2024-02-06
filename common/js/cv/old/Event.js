var cv = cv || {}, trace = trace || alert;

// scrollDelta instead of wheelDelta
// client object contains adjusted FireFox client props
cv.addEventListener = function(el, type, fn) {
	if (el.addEventListener) {
		el[type + fn] = function(e) {
			// Can't wrap native functions (i.e. preventDefault), errors
			/*var e = {};
			for(var p in evt) {
				e[p] = evt[p]; // Deep copy evt since it's props are read-only
			}
			e.clientX = e.pageX - window.pageXOffset; // Are read-only props
			e.clientY = e.pageY - window.pageYOffset; // Are read-only props
			*/
			
			if (e.clientX && e.clientY) { e.client = {x:e.pageX - window.pageXOffset, y:e.pageY - window.pageYOffset}; }
			
			if (e.pageX && e.pageY)  { e.page = {x:e.pageX, y:e.pageY}; } // Just for completeness' sake
			
			if (e.layerX && e.layerY) { e.layer = {x:e.layerX, y:e.layerY}; } // Just for completeness' sake
			
			if (e.screenX && e.screenY) { e.screen = {x:e.screenX, y:e.screenY}; } // Just for completeness' sake
			
			while (e.target && e.target.nodeType === 3) { e.target = e.target.parentNode; }
			
			if (type.match(/DOMMouseScroll|mousewheel/)) { e.scrollDelta = -(e.detail || 0) / 3; } // Non W3c
			
			if (e.which) { e.rightClick = (e.which === 3); } // Non W3C
			
			// Give up on 'Permission denied to get property HTMLDivElement.nodeType'
			// See https://bugzilla.mozilla.org/show_bug.cgi?id=208427
			try{
				while (e.relatedTarget && e.relatedTarget.nodeType === 3) { e.relatedTarget = e.relatedTarget.parentNode; }
			} catch(err) { }
			
			fn(e);
		};
		el.addEventListener(type, el[type + fn], false);
	} else if(el.attachEvent) {
		el[type + fn] = function() {
			var e = window.event;
			e.target = e.srcElement;
			while (e.target && e.target.nodeType === 3) { e.target = e.target.parentNode; }
			e.which = e.keyCode;
			e.charCode = e.keyCode;
			
			e.layerX = e.offsetX;
			e.layerY = e.offsetY;
			e.layer = {x:e.layerX, y:e.layerY};
			
			e.preventDefault = function() { this.returnValue = false; };
			e.stopPropagation = function() { this.cancelBubble = true; };
			
			if (e.clientX && e.clientY) { e.client = {x:e.clientX, y:e.clientY}; }
			
			if (e.screenX && e.screenY) { e.screen = {x:e.screenX, y:e.screenY}; }
			
			e.pageX = e.clientX + document.body.scrollLeft - document.body.clientLeft;
			e.pageY = e.clientY + document.body.scrollTop - document.body.clientTop;
			e.page = {x:e.pageX, y:e.pageY};
			
			if (type.match(/DOMMouseScroll|mousewheel/)) { e.scrollDelta = e.wheelDelta / 120; } // Non W3c
			
			e.rightClick = (e.button === 2); // Non W3c
			
			if (type.match(/(click|mouse|menu)/i)) {
				e.relatedTarget = null;
				if (type.match(/over|out/)) {
					e.relatedTarget = (type === 'onMouseover') ? e.fromElement : e.toElement;
					while (e.relatedTarget && e.relatedTarget.nodeType === 3) { e.relatedTarget = e.relatedTarget.parentNode; }
				}
			}
			
			fn(e);
		};
		el.attachEvent("on" + type, el[type + fn] );
	} else {
		trace("No addEventListener or attachEvent for: " + el);
	}
};

cv.removeEventListener = function(el, type, fn) {
	if (el.removeEventListener) {
		el.removeEventListener(type, el[type + fn], false);
		el[type + fn] = null;
	} else if(el.detachEvent) {
		el.detachEvent("on" + type, el[type + fn] );
		el[type + fn] = null;
	} else {
		trace("No removeEventListener or detachEvent for: " + el);
	}
};

/*
Bubbling and cancelable are both enabled as you can't change this for IE

el : Element to dispatch from
type : Event type
object[optional] : What event object to dispatch. can be: HTMLEvents, MouseEvents, UIEvents, etc...
*/
cv.dispatchEvent = function(el, type, object) {
	var e;
	if(document.createEvent) {
		// dispatch for firefox + others
		e = document.createEvent(object || "HTMLEvents");
		e.initEvent(type, true, true); // event type, bubbling, cancelable
		el.dispatchEvent(e);
	} else {
		// dispatch for IE
		e = document.createEventObject();
		try {
			el.fireEvent("on" + type, e);
		} catch(err) {
			trace("Event: 'on" + type + "' not allowed to be dispatched from " + el.nodeName);
		}
	}
};