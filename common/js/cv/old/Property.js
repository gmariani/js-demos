/*
Script: Property.js
	Handles cross-browser properties/attributes
	
	Thanks MooTools 1.2.3

License:
	MIT-style license.
*/

var cv = cv || {};

(function() {

	function associate(arr, keys, lowerCase) {
		var obj = {}, l = Math.min(arr.length, keys.length), i;
		for (i = 0; i < l; i++) { obj[lowerCase ? String.toLowerCase(keys[i]) : keys[i]] = arr[i]; }
		return obj;
	}
	
	function extend(orig, ext) {
		for (var key in ext) { orig[key] = ext[key]; }
	}
	
	var attributes = {
		'html': 'innerHTML',
		'class': 'className',
		'for': 'htmlFor',
		'defaultValue': 'defaultValue',
		'text': (window.ActiveXObject) ? 'innerText' : 'textContent' /* Browser.Engine.webkit && Browser.Engine.version < 420 is innerText */
	},
	bools = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readonly', 'multiple', 'selected', 'noresize', 'defer'],
	camels = ['value', 'type', 'defaultValue', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap'];
	bools = associate(bools, bools, false);
	camels = associate(camels, camels, true);
	extend(attributes, bools);
	extend(attributes, camels);
	
	cv.getProperty = function(el, attr) {
		var key = attributes[attr], value = (key) ? el[key] : el.getAttribute(attr, 2);
		return (bools[attr]) ? !!value : (key) ? value : value || null;
	};

	cv.setProperty = function(el, attr, value) {
		var key = attributes[attr];
		if (value === undefined) { return el.removeProperty(attr); }
		if (key && bools[attr]) { value = !!value; }
		if (key) {
			el[key] = value;
		} else {
			el.setAttribute(attr, '' + value);
		}
		return el;
	};
	
	cv.removeProperty = function(el, attr) {
		var key = attributes[attr];
		if (key) {
			el[key] = (key && bools[attr]) ? false : '';
		} else {
			el.removeAttribute(attr);
		}
		return el;
	};

})();