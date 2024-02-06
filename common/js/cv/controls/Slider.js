/*
Script: Slider.js

License:
	MIT-style license.
*/

var cv = cv || {};
cv.controls = cv.controls || {};

cv.controls.Slider = function (element, options) {
    // Used to cut down on file size, instead of 30 times of opt.hasOwnProperty
    function hOP(n, v, d) {
        return opt.hasOwnProperty(n) ? v : d;
    }

    var _ = this,
        eventList = ['focus', 'blur', 'change', 'init', 'destroy'],
        aEL = cv.addEventListener,
        rEL = cv.removeEventListener,
        lbl,
        i,
        opt = options || {},
        vertical = hOP('vertical', !!opt.vertical, false),
        arrowsEnabled = hOP('arrows', !!opt.arrows, false),
        barEnabled = hOP('bar', !!opt.bar, false);

    //--------------------------------------
    //  Public Vars
    //--------------------------------------

    // The number of pixels to move each time you click the arrow buttons
    _.increment = hOP('increment', +opt.increment, 5);

    // Number of pixels to move when CTRL is held down
    _.maxIncrement = hOP('maxIncrement', +opt.maxIncrement, _.increment * 2);

    // MouseWheel support
    _.mouseWheelEnabled = hOP('mouseWheel', !!opt.mouseWheel, true);

    // The target input element
    _.src = element;

    // The target input tag name
    _.srcTag = element.tagName.toLowerCase();

    _.max = hOP('max', +opt.max, 1);

    _.min = hOP('min', +opt.min, 1);

    // Whether to snap to specific points or not
    _.snapEnabled = hOP('snap', !!opt.snap, false);

    // Whether when the position changes, the thumb should tween to position
    _.tweenEnabled = hOP('tween', !!opt.tween, false);
    console.log(opt);
    // While tweening, should the change callback be called on each update?
    _.tweenUpdateEnabled = hOP('tweenUpdate', !!opt.tweenUpdate, false);

    // Whether the user can click on the track and jump to a position
    _.jumpEnabled = hOP('jump', !!opt.jump, false);

    // Minimum scroll pixel position
    _.minPx = 0;

    //--------------------------------------
    //  Private Vars
    //--------------------------------------

    // Current pixel position
    _._position = 0;

    // Init callbacks
    _._callbacks = {};
    for (i = 0; i < eventList.length; i++) {
        _._callbacks[eventList[i]] = [];
    }

    //--------------------------------------
    //  Constructor
    //--------------------------------------

    // Init Slider
    _.slider = document.createElement('div');
    _.slider.className = 'cv-slider' + (vertical ? '-vertical ' : ' ');
    _.slider.id = 'cv-slider-' + _.src.id;
    aEL(_.slider, 'mouseover', sliderHandler);
    aEL(_.slider, 'mouseout', sliderHandler);
    aEL(_.slider, 'mousedown', sliderHandler);

    // Init Track
    _.track = document.createElement('div');
    _.track.className = 'cv-slider-track';

    // Init Bar
    if (barEnabled) {
        _.innerBar = document.createElement('span');
        _.innerBar.className = 'cv-slider-bar';
    }

    // Init Left Btn
    //_.leftBtn;
    if (arrowsEnabled) {
        _.leftBtn = document.createElement('span');
        _.leftBtn.className = 'cv-slider-left';
        aEL(_.leftBtn, 'mousedown', leftHandler);
    }

    // Init Right Btn
    //_.rightBtn;
    if (arrowsEnabled) {
        _.rightBtn = document.createElement('span');
        _.rightBtn.className = 'cv-slider-right';
        aEL(_.rightBtn, 'mousedown', rightHandler);
    }

    // Init Thumb
    _.thumb = document.createElement('span');
    _.thumb.setAttribute(!(/*@cc_on!@*/ false) ? 'tabIndex' : 'tabindex', '0');
    _.thumb.className = 'cv-slider-thumb';
    _.thumb.id = 'cv-slider-thumb-' + _.src.id;
    lbl = findLabel();
    if (lbl) {
        _.thumb.setAttribute('aria-labelledby', lbl.id);
        if (window.ActiveXObject) {
            lbl.setAttribute('htmlFor', _.thumb.id);
        } else {
            lbl.setAttribute('for', _.thumb.id);
        }
    }
    // Add ARIA accessibility info programmatically
    _.thumb.setAttribute('role', 'slider');
    _.thumb.setAttribute('aria-valuemin', 0);
    _.thumb.setAttribute('aria-valuemax', 1);
    _.thumb.appendChild(document.createTextNode(String.fromCharCode(160)));
    if (!window.opera) {
        aEL(_.thumb, 'keydown', thumbHandler);
        aEL(_.thumb, 'keypress', thumbHandler);
    } else {
        aEL(_.thumb, 'keypress', thumbHandler);
    }
    aEL(_.thumb, 'mousedown', thumbHandler);
    aEL(_.thumb, 'focus', thumbHandler);
    aEL(_.thumb, 'blur', thumbHandler);

    // Add parts to container
    _.slider.appendChild(_.track);
    if (_.innerBar) {
        _.track.appendChild(_.innerBar);
    }
    if (_.leftBtn) {
        _.track.appendChild(_.leftBtn);
    }
    if (_.rightBtn) {
        _.track.appendChild(_.rightBtn);
    }
    _.track.appendChild(_.thumb);

    // Add container to page
    _.src.parentNode.insertBefore(_.slider, _.src);

    // Hide src element?
    if (!!opt.hideInput) {
        _.src.className += ' cv-slider-input';
    } else {
        aEL(_.src, 'change', sourceHandler);
    }

    //--------------------------------------
    //  Public Vars
    //--------------------------------------

    // Adjust minimum if left button exists
    if (arrowsEnabled) {
        _.minPx += _.leftBtn.scrollWidth;
    }

    // Number of scrollable pixels
    _.totalPx = _.track.scrollWidth - (_.rightBtn ? _.rightBtn.scrollWidth : 0) - _.minPx - _.thumb.scrollWidth;

    // Maximum scroll pixel position
    _.maxPx = _.totalPx + _.thumb.scrollWidth / 2;

    // Disable selecting of text (i think there is a text node in the thumb for example
    if (_.slider.unselectable) {
        _.thumb.unselectable = 'on';
        if (_.innerBar) {
            _.innerBar.unselectable = 'on';
        }
        if (_.leftBtn) {
            _.leftBtn.unselectable = 'on';
        }
        if (_.rightBtn) {
            _.rightBtn.unselectable = 'on';
        }
        _.track.unselectable = 'on';
        _.slider.unselectable = 'on';
    }

    // TODO: Added aria-describedby
    // Are there page instructions - the creation of the instructions has been left up to you fine reader...
    /*if(document.getElementById("fd_slider_describedby")) {
		_.thumb.setAttribute("aria-describedby", "fd_slider_describedby");  // aaa:describedby
	};*/

    //--------------------------------------
    //  Private Methods
    //--------------------------------------

    function stopEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    // See if there is an associated Label tag for the source input element
    function findLabel() {
        var lbl,
            src = _.src,
            labelList = document.getElementsByTagName('label'),
            i = labelList.length,
            l;
        if (src.parentNode && src.parentNode.tagName.toLowerCase() === 'label') {
            lbl = src.parentNode;
        } else {
            while (i--) {
                l = labelList[i];
                // Internet Explorer requires the htmlFor test
                if ((l.htmlFor && l.htmlFor === src.id) || l.getAttribute('for') === src.id) {
                    lbl = l;
                    break;
                }
            }
        }
        if (lbl && !lbl.id) {
            lbl.id = src.id + '_label';
        }
        return lbl;
    }

    function sourceHandler(e) {
        _.setValue(_.getValue());
    }

    function leftHandler(e) {
        stopEvent(e);
        _.setPosition(_.getPosition() - getIncrement());
    }

    function rightHandler(e) {
        stopEvent(e);
        _.setPosition(_.getPosition() + getIncrement());
    }

    function thumbHandler(e) {
        var kc, delta, value;
        switch (e.type) {
            case 'mousedown':
                e.preventDefault();
                aEL(document, 'mousemove', thumbHandler);
                aEL(document, 'mouseup', thumbHandler);
                return false;
            case 'mouseup':
                rEL(document, 'mousemove', thumbHandler);
                rEL(document, 'mouseup', thumbHandler);
                break;
            case 'mousemove':
                _.setPosition(e.pageX - _.track.offsetLeft);
                return false;
            case 'focus':
                _.track.className = _.track.className.replace('cv-slider-focus', '') + ' cv-slider-focus';
                if (_.mouseWheelEnabled) {
                    aEL(window, 'DOMMouseScroll', thumbHandler);
                    aEL(document, 'mousewheel', thumbHandler);
                    if (!window.opera) {
                        aEL(window, 'mousewheel', thumbHandler);
                    }
                }
                _.callBack('focus');
                break;
            case 'blur':
                _.track.className = _.track.className.replace('cv-slider-focus', '');
                if (_.mouseWheelEnabled) {
                    rEL(document, 'mousewheel', thumbHandler);
                    rEL(window, 'DOMMouseScroll', thumbHandler);
                    if (!window.opera) {
                        rEL(window, 'mousewheel', thumbHandler);
                    }
                }
                _.callBack('blur');
                break;
            case 'DOMMouseScroll':
            case 'mousewheel':
                delta = e.scrollDelta || 0;
                if (vertical) {
                    delta = -delta;
                }
                if (delta !== 0) {
                    _.setPosition(_.getPosition() + getIncrement() * delta);
                }
                stopEvent(e);
                break;
            case 'keydown':
                kc = e.keyCode;
                if (kc < 33 || (kc > 40 && kc !== 45 && kc !== 46)) {
                    return true;
                }

                value = _.getPosition();
                if (kc === 37 || kc === 40 || kc === 46 || kc === 34) {
                    // left, down, ins, page down
                    value -= e.ctrlKey || kc === 34 ? getIncrement(_.maxIncrement) : getIncrement();
                } else if (kc === 39 || kc === 38 || kc === 45 || kc === 33) {
                    // right, up, del, page up
                    value += e.ctrlKey || kc === 33 ? getIncrement(_.maxIncrement) : getIncrement();
                } else if (kc === 35) {
                    // max
                    value = _.maxPx;
                } else if (kc === 36) {
                    // min
                    value = _.minPx;
                }

                _.setPosition(value);
                break;
            case 'keypress':
                if ((e.keyCode >= 33 && e.keyCode <= 40) || e.keyCode === 45 || e.keyCode === 46) {
                    stopEvent(e);
                }
                return true;
        }
    }

    function sliderHandler(e) {
        switch (e.type) {
            case 'mousedown':
                _.thumb.focus();
                if (_.jumpEnabled) {
                    _.setPosition(e.clientX - _.minPx);
                }
                break;
            case 'mouseout':
                _.track.className = _.track.className.replace('cv-slider-hover', '');
                break;
            case 'mouseover':
                _.track.className = _.track.className.replace('cv-slider-hover', '') + ' cv-slider-hover';
                break;
        }
    }

    function getIncrement(inc) {
        return _.srcTag === 'select' ? _.maxPx / _.max : inc || _.increment;
    }

    _.update();
    _.callBack('init');
};

//--------------------------------------
//  Static Vars
//--------------------------------------

cv.controls.Slider.VERSION = 2.0;

cv.controls.Slider.prototype = {
    //--------------------------------------
    //  Properties
    //--------------------------------------

    /**
     * Gets or sets the absolute pixel position of the thumb
     */
    getPosition: function () {
        return this._position + this.minPx + this.thumb.scrollWidth / 2;
    },
    /** @private */
    setPosition: function (v) {
        var _ = this,
            stepPx = _.srcTag === 'select' ? _.maxPx / _.max : _.increment,
            rem = v % stepPx;
        if (_.snapEnabled) {
            v += rem && rem >= stepPx / 2 ? stepPx - rem : rem * -1;
        }

        // Remove left margin
        v -= _.minPx;

        // Center Thumb with cursor
        v -= _.thumb.scrollWidth / 2;

        // Minimum
        if (v < 0) {
            v = 0;
        }

        // Maximum
        if (v > _.totalPx) {
            v = _.totalPx;
        }

        if (!_.tweenEnabled) {
            _.thumb.style.left = v + 'px';
            //__.thumb.style[vertical ? "top" : "left"] = Math.round(((value - min) / inc) * stepPx) + "px";
        } else {
            if (TweenLite) {
                TweenLite.to(_.thumb, 0.5, { left: v, onUpdate: _.tweenUpdateEnabled ? _.update : null, onUpdateParams: [_] });
            } else {
                trace('Slider::setPosition : TweenLite not available for tweening. Please include TweenLite.js.');
            }
        }

        _.update();
    },

    /**
     * Gets or sets the slider percentage
     */
    getPercent: function () {
        return this._position / this.totalPx;
    },
    /** @private */
    setPercent: function (v) {
        this.setPosition(this.totalPx * v);
    },

    /**
     * Gets or sets the input value
     */
    getValue: function () {
        return this.srcTag === 'input' ? parseFloat(this.src.value) : this.src.selectedIndex;
    },
    /** @private */
    setValue: function (v) {
        var _ = this;
        if (isNaN(v) || v < Math.min(_.min, _.max)) {
            v = Math.min(_.min, _.max);
        } else if (v > Math.max(_.min, _.max)) {
            v = Math.max(_.min, _.max);
        }

        _.setPercent(v / _.max);
    },

    //--------------------------------------
    //  Public Methods
    //--------------------------------------

    update: function (__) {
        var _ = __ || this,
            val;

        // Update Thumb var
        _._position = parseFloat(_.thumb.style.left || 0);

        // Update Source
        val = _.getPercent() * _.max;
        val = isNaN(val) ? _.min : val;
        if (_.srcTag === 'select') {
            try {
                val = Math.ceil(val);
                if (_.src.selectedIndex === val) {
                    return;
                }
                _.src.options[val].selected = true;
            } catch (err) {}
        } else {
            //val = (min + (Math.round((val - min) / inc) * inc)).toFixed(precision);
            if (_.src.value === val) {
                return;
            }
            _.src.value = val;
        }

        // Update Aria
        _.thumb.setAttribute('aria-valuenow', _.srcTag === 'select' ? _.src.options[_.src.selectedIndex].value : _.src.value);
        _.thumb.setAttribute('aria-valuetext', _.srcTag === 'select' ? _.src.options[_.src.selectedIndex].text : _.src.value);

        _.callBack('change');
    },

    /*destroy: function() {
		var rEL = cv.Events.removeEventListener;
		// remove all listeners and jazz
		try {
			rEL(this.slider, "mouseover", sliderHandler);
			rEL(this.slider, "mouseout",  sliderHandler);
			rEL(this.slider, "mousedown", sliderHandler);
			rEL(this.thumb, "focus", thumbHandler);
			rEL(this.thumb, "blur", thumbHandler);
			/if(!window.opera) {
				rEL(this.thumb, "keydown",   onKeyDown);
				rEL(this.thumb, "keypress",  onKeyPress);
			} else {
				rEL(this.thumb, "keypress",  onKeyDown);
			};/
			rEL(this.thumb, "mousedown", thumbHandler);
			rEL(this.thumb, "mouseup",   thumbHandler);

			if(this.mouseWheelEnabled) {
				rEL(document, 'mousewheel', thumbHandler);
				rEL(window, 'DOMMouseScroll', thumbHandler);
				if(!window.opera) rEL(window, 'mousewheel', thumbHandler);
			};

			this.slider.parentNode.removeChild(this.slider);
		} catch(err) { };

		this.track = this.innerBar = this.thumb = this.slider = null;
		callback("destroy");
	}*/

    callBack: function (type) {
        var i,
            f,
            src = this.src,
            e = {
                source: src,
                value: this.srcTag === 'select' ? src.options[src.selectedIndex].value : src.value,
                percent: this.getPercent(),
                position: this.getPosition(),
            };

        try {
            for (i = 0; (f = this._callbacks[type][i]); i++) {
                f(e);
            }
        } catch (err) {
            trace('Slider::callBack :', err);
        }
    },

    addCallBack: function (type, fn) {
        if (this._callbacks[type]) {
            return this._callbacks[type].push(fn);
        }
        return NaN;
    },

    removeCallBack: function (type, index) {
        if (this._callbacks[type]) {
            var cb = this._callbacks[type],
                rest;
            if (cb[index]) {
                rest = cb.slice(index + 1);
                cb.length = index;
                cb.push.apply(cb, rest);
                return true;
            } else {
                return false;
            }
        }
        return false;
    },
};
