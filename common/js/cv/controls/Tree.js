/*
Script: Tree.js
	Tree menu

	Requires : cv.DOM

License:
	MIT-style license.
*/

var cv = cv || {};
cv.controls = cv.controls || {};

cv.controls.Tree = function (element, spacing) {
    /**
     * Gets/Sets type of easing function to use
     */
    this.ease = gs.TweenLite.defaultEase;

    /**
     * Gets/Sets duration of the tween
     *
     * @default 0.5
     */
    this.tweenTime = 0.5;

    /**
     * The target div element
     */
    this.source = element;

    /**
     * The target LI element
     */
    this.toggleNodes;
    this.contentNodes;

    // Private //
    this._index;
    this._selected;
    this._arrHeights;
    var _this = this;
    this._downHandler = function (e) {
        _this.selectItem(e.target);
    };

    // Init
    this.update();
};

//--------------------------------------
//  Static Vars
//--------------------------------------

cv.controls.Accordion.VERSION = 1.0;

cv.controls.Accordion.prototype = {
    //--------------------------------------
    //  Properties
    //--------------------------------------

    /**
     * Gets or sets the selected item
     */
    getSelected: function () {
        return this._selected;
    },
    /** @private */
    setSelected: function (v) {
        selectItem(v);
    },

    /**
     * Gets or sets the selected index
     */
    getSelectedIndex: function () {
        return index;
    },
    /** @private */
    setSelectedIndex: function (v) {
        selectIndex(v);
    },

    //--------------------------------------
    //  Public Methods
    //--------------------------------------

    addEventListener: function (strType, fn) {
        cv.addEventListener(this.source, strType, fn);
    },

    removeEventListener: function (strType, fn) {
        cv.removeEventListener(this.source, strType, fn);
    },

    dispatchEvent: function (strType) {
        cv.dispatchEvent(this.source, strType);
    },

    update: function () {
        var i;
        if (this.toggleNodes) {
            i = this.toggleNodes.length;
            while (i--) {
                cv.removeEventListener(this.toggleNodes[i], 'mousedown', this._downHandler);
            }
        }

        this.toggleNodes = cv.DOM.getChildrenByClassName(this.source, 'toggler');
        this.contentNodes = cv.DOM.getChildrenByClassName(this.source, 'element');
        this._arrHeights = [];

        i = this.toggleNodes.length;
        while (i--) {
            cv.addEventListener(this.toggleNodes[i], 'mousedown', this._downHandler);
            this._arrHeights.push(parseFloat(cv.getStyle(this.contentNodes[i], 'height')));
            cv.setStyle(this.contentNodes[i], 'height', '0px');
        }

        this.selectIndex(0);
    },

    /**
     * Select the specified item in the carousel
     *
     * @param	item The item to select
     * @return	If the item was selected successfully or not
     */
    selectItem: function (item) {
        var idx = NaN,
            i = this.toggleNodes.length;
        while (i--) {
            if (this.toggleNodes[i] === item) {
                idx = i;
                break;
            }
        }

        return this.selectIndex(idx);
    },

    selectIndex: function (idx) {
        var item = this.toggleNodes[idx],
            i = this.toggleNodes.length;
        if (item) {
            while (i--) {
                if (this.toggleNodes[i] === item) {
                    gs.TweenLite.to(this.contentNodes[i], this.tweenTime, { height: this._arrHeights[i], ease: this.ease, units: 'px' });
                } else {
                    gs.TweenLite.to(this.contentNodes[i], this.tweenTime, { height: 0, ease: this.ease, units: 'px' });
                }
            }

            this._index = idx;
            this._selected = item;

            return true;
        } else {
            this._index = NaN;
            this._selected = null;

            trace("Tree - Error: Can't find toggler");
            return false;
        }
    },
};
