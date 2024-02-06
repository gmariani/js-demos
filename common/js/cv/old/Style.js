/*
Script: Style.js
	Handles cross-browser styles
	
	Requires : cv.String
	
	Thanks MooTools 1.2.2

License:
	MIT-style license.
*/

var cv = cv || {};

cv.getStyle = function(el, prop) {
	if (prop === 'float') { prop = (el.style.styleFloat) ? 'styleFloat' : 'cssFloat'; }
	
	if (prop === 'opacity' && el.currentStyle) {
		return el.style.filter.alpha ? el.style.filter.alpha / 100 : 1;
	}
	
	var result = el.style[prop], value, computed, size = 0;
	if (!result && result !== 0) {
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
			value = (prop === 'width') ? ['left', 'right'] : ['top', 'bottom'];
			size += parseInt(cv.getStyle(el, 'border-' + value[0] + '-width'), 10) + parseInt(cv.getStyle(el, 'padding-' + value[0]), 10);
			size += parseInt(cv.getStyle(el, 'border-' + value[1] + '-width'), 10) + parseInt(cv.getStyle(el, 'padding-' + value[1]), 10);
			return el['offset' + cv.String.capitalize(prop)] - size + 'px';
		}
		//if ((Browser.Engine.presto) && String(result).test('px')) return result; // Opera
		if (/(border(.+)Width|margin|padding)/.test(prop)) { return '0px'; }
	}
	
	return result;
};

cv.setStyle = function(el, prop, value) {
	if(prop === 'float') { prop = (el.style.styleFloat) ? 'styleFloat' : 'cssFloat'; }
	
	if(prop === 'opacity') {
		value = parseFloat(value);
		el.style.visibility = (value === 0) ? 'hidden' : 'visible';
		if (!el.currentStyle || !el.currentStyle.hasLayout) { el.style.zoom = 1; }
		el.style.filter = (value === 1) ? '' : 'alpha(opacity=' + value * 100 + ')';
		el.style.opacity = value;
		return;
	}
	
	prop = cv.String.camelCase(prop);
	el.style[prop] = value;
};