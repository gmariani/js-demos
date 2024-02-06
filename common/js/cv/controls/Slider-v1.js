cv.controls.Slider = function (element) {
    var _this = this,
        byCN = cv.DOM.getChildrenByClassName,
        aEL = cv.Events.addEventListener,
        rEL = cv.Events.removeEventListener;

    /**
     * The target DIV element
     */
    this.source = element;

    /**
     * The number of pixels to move each time you click the arrow buttons
     */
    this.moveAmount = 5;

    /**
     * MouseWheel support
     */
    this.mouseWheelEnabled = true;

    /**
     * The track element
     */
    this.track = byCN(element, 'track')[0];

    /**
     * The left button element
     */
    this.leftBtn = byCN(this.track, 'leftBtn')[0];

    /**
     * The right button element
     */
    this.rightBtn = byCN(this.track, 'rightBtn')[0];

    /**
     * The thumb button element
     */
    this.thumb = byCN(this.track, 'thumb')[0];

    // Private //
    this._position = 0;
    this._minimum = 0;

    // Init //
    aEL(this.thumb, 'mousedown', this._thumbDownHandler);
    aEL(this.source, 'focus', this._focusHandler);
    aEL(this.source, 'blur', this._blurHandler);

    // Left
    if (this.leftBtn) {
        this._minimum += this.leftBtn.scrollWidth;
        this._leftDownHandler = function (e) {
            // leftBtn scope
            e.preventDefault();
            _this.setPosition(_this.getPosition() + _this._minimum + _this.thumb.scrollWidth / 2 - _this.moveAmount);
        };
        aEL(this.leftBtn, 'mousedown', this._leftDownHandler);
    }

    // Right
    if (this.rightBtn) {
        this._rightDownHandler = function (e) {
            // rightBtn scope
            e.preventDefault();
            _this.setPosition(_this.getPosition() + _this._minimum + _this.thumb.scrollWidth / 2 + _this.moveAmount);
        };
        aEL(this.rightBtn, 'mousedown', this._rightDownHandler);
    }

    // Thumb
    this._thumbDownHandler = function (e) {
        // thumb scope
        e.preventDefault(); // Disables image drag, but disables mouse down css
        //e.stopPropagation (); // Allows mouse down css, but causes image drag
        aEL(document, 'mousemove', _this._thumbMoveHandler);
        aEL(document, 'mouseup', _this._thumbUpHandler);
        return false;
    };
    this._thumbMoveHandler = function (e) {
        // thumb scope
        _this.setPosition(e.pageX - _this.track.offsetLeft);
        return false;
    };
    this._thumbUpHandler = function (e) {
        // thumb scope
        rEL(document, 'mousemove', _this._thumbMoveHandler);
        rEL(document, 'mouseup', _this._thumbUpHandler);
    };

    // Slider
    this._focusHandler = function (e) {
        //_this.source.className = _this.source.className.replace('focused','') + ' focused';
        if (_this.mouseWheelEnabled) {
            aEL(window, 'DOMMouseScroll', _this._mouseWheelHandler);
            aEL(document, 'mousewheel', _this._mouseWheelHandler);
            if (!window.opera) aEL(window, 'mousewheel', _this._mouseWheelHandler);
        }
        //callback("focus");
    };

    this._blurHandler = function (e) {
        //_this.source.className = _this.source.className.replace('focused','');
        if (_this.mouseWheelEnabled) {
            rEL(document, 'mousewheel', _this._mouseWheelHandler);
            rEL(window, 'DOMMouseScroll', _this._mouseWheelHandler);
            if (!window.opera) rEL(window, 'mousewheel', _this._mouseWheelHandler);
        }
        //callback("blur");
    };

    this._mouseWheelHandler = function (e) {
        var delta = e.wheelDelta || 0;

        //if(vertical) { delta = -delta; };

        if (delta) {
            /*var xtmp = vertical ? handle.offsetTop : handle.offsetLeft;
			xtmp = (delta < 0) ? Math.ceil(xtmp + deltaPx) : Math.floor(xtmp - deltaPx);
			pixelsToValue(Math.min(Math.max(xtmp, 0), maxPx));*/
        }

        e.stopPropogation();
    };

    this._totalWidth = this.track.scrollWidth - (this.rightBtn ? this.rightBtn.scrollWidth : 0) - this._minimum - this.thumb.scrollWidth;
};

//--------------------------------------
//  Static Vars
//--------------------------------------

cv.controls.Slider.VERSION = 1.0;

cv.controls.Slider.prototype = {
    //--------------------------------------
    //  Properties
    //--------------------------------------

    /**
     * Gets or sets the pixel position of the thumb
     */
    getPosition: function () {
        return this._position;
    },
    /** @private */
    setPosition: function (v) {
        // Remove left margin
        v -= this._minimum;

        // Center Thumb with cursor
        v -= this.thumb.scrollWidth / 2;

        // Minimum
        if (v < 0) v = 0;

        // Maximum
        if (v > this._totalWidth) v = this._totalWidth;

        // Set position
        this._position = v;
        this.thumb.style.left = v + 'px';

        this.dispatchEvent('change');
    },

    /**
     * Gets or sets the slider percentage
     */
    getPercent: function () {
        return this.getPosition() / this._totalWidth;
    },
    /** @private */
    setPercent: function (v) {
        setPosition(this._totalWidth * v);
    },

    //--------------------------------------
    //  Public Methods
    //--------------------------------------

    addEventListener: function (type, fn) {
        cv.Events.addEventListener(this.source, type, fn);
    },

    removeEventListener: function (type, fn) {
        cv.Events.removeEventListener(this.source, type, fn);
    },

    dispatchEvent: function (type) {
        cv.Events.dispatchEvent(this.source, type);
    },
};
