/*
Script: Carousel.js

License:
	MIT-style license.
*/

var cv = cv || {};
cv.controls = cv.controls || {};

cv.controls.Carousel = function (element, spacing) {
    /**
     * Will automatically fade items as they near edges
     */
    this.autoAlpha = true;

    /**
     * Gets/Sets type of easing function to use
     */
    this.ease = TweenLite.defaultEase;

    /**
     * Gets/Sets spacing between items. Modifies radius of carousel.
     */
    this.spacing = spacing || 0;

    /**
     * Gets/Sets duration of the tween
     *
     * @default 0.5
     */
    this.tweenTime = 0.5;

    /**
     * The target UL element
     */
    this.source = element;

    /**
     * The target LI element
     */
    this.items = this.source.getElementsByTagName('li');

    // Private //
    this._align = 'CENTER';
    this._selected;
    this._selectedPrevious;
    this._index = 0;
    this._tl; // TweenLite
    this._tweenObject = { radian: 0 };

    // Init
    this._move(0, 1);
};

cv.controls.Carousel.VERSION = 1.0;

cv.controls.Carousel.prototype = {
    //--------------------------------------
    //  Properties
    //--------------------------------------

    /**
     * Gets/Sets the vertical alignment of items.
     * can be 'TOP, 'CENTER', or 'BOTTOM'
     */
    getAlign: function () {
        return this._align;
    },
    /** @private */
    setAlign: function (v) {
        // validation
        switch (v) {
            case 'TOP':
            case 'CENTER':
            case 'BOTTOM':
                break;
            default:
                return;
        }

        this._align = v;
    },

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

    /**
     * Gets the previously selected item
     */
    getSelectedPrevious: function () {
        return this._selectedPrevious;
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
        this.items = this.source.getElementsByTagName('li');
        this._render();
        this._render();
    },

    /**
     * Select the specified item in the carousel
     *
     * @param	item The item to select
     * @return	If the item was selected successfully or not
     */
    selectItem: function (item) {
        var idx,
            l = this.items.length,
            i,
            delta,
            il = styles.get(item, 'left'),
            sl = styles.get(this._selected, 'left');
        for (i = 0; i < l; i++) {
            if (this.items[i] === item) {
                idx = i;
                break;
            }
        }

        // Find shortest path to item
        if (il > sl && idx > this._index) {
            idx = 0 - (l - idx);
        } else if (il < sl && idx < this._index) {
            idx = idx + l;
        }

        if (!isNaN(idx)) {
            delta = this._abs(this._index - idx);
            if (idx > this._index) {
                previous(delta);
            } else {
                next(delta);
            }
            return true;
        } else {
            trace("Carousel - Error: Can't find item");
            return false;
        }
    },

    selectIndex: function (idx) {
        var item = this.items[idx],
            l = this.items.length,
            delta;
        if (item) {
            // Find shortest path to item
            if (item.style.left > this._selected.style.left && idx > this._index) {
                idx = 0 - (l - idx);
            } else if (item.style.left < this._selected.style.left && idx < this._index) {
                idx = idx + l;
            }

            delta = this._abs(this._index - idx);
            if (idx > this._index) {
                previous(delta);
            } else {
                next(delta);
            }
            return true;
        } else {
            trace("Carousel - Error: Can't find item");
            return false;
        }
    },

    /**
     * Move carousel right
     *
     * @param	amount Amount to move the carousel by
     */
    next: function (amount) {
        this._move(amount || 1, 1);
        //cv.Events.dispatchEvent(this.source, NEXT);
        this.dispatchEvent('change');
    },

    /**
     * Move carousel left
     *
     * @param	amount Amount to move the carousel by
     */
    previous: function (amount) {
        this._move(amount || 1, -1);
        //cv.Events.dispatchEvent(this.source, PREVIOUS);
        this.dispatchEvent('change');
    },

    //--------------------------------------
    //  Protected Methods
    //--------------------------------------

    _abs: function (value) {
        return value < 0 ? -value : value;
    },

    /*_dispatchChange: function() {
		this._render();
		//this.dispatchEvent("change"); // Can't dispatch change from UL (IE8)
	},*/

    _move: function (amount, direction) {
        var moveAmount = amount * ((Math.PI * 2) / this.items.length);
        if (this._tl && this._tl.active) this._tl.complete();
        this._tl = TweenLite.to(this._tweenObject, this.tweenTime, {
            radian: '+=' + String(moveAmount * direction),
            ease: this.ease,
            onComplete: this._render,
            onCompleteScope: this,
            onUpdate: this._render,
            onUpdateScope: this,
        });
    },

    _render: function () {
        var i = this.items.length,
            item,
            bnds,
            nextRad,
            nextX,
            itemRad,
            itemCenter,
            itemAlpha,
            itemX,
            itemOffSet,
            radius = this.source.offsetWidth / 2 + this.spacing,
            centerX = this.source.offsetWidth / 2,
            closestItem = this.items[0] || null,
            closestIndex = NaN,
            closestCenter,
            closestBounds = {
                left: closestItem.style.left || closestItem.offsetLeft,
                width: closestItem.style.width || closestItem.offsetWidth,
                height: closestItem.style.height || closestItem.offsetHeight,
            },
            yCoord = 0,
            radian = parseFloat(this._tweenObject.radian);

        if (i > 0) {
            while (i--) {
                item = this.items[i];
                bnds = { left: item.offsetLeft, width: item.offsetWidth, height: item.offsetHeight };
                itemCenter = bnds.left + bnds.width / 2;

                // Get starting x coord of item section
                itemRad = ((Math.PI * 2) / this.items.length) * i;
                itemX = radius * Math.cos(itemRad + radian);

                // Get ending x coord of item section
                nextRad = ((Math.PI * 2) / this.items.length) * (i + 1);
                nextX = radius * Math.cos(nextRad + radian);

                // Get offset to center item between both x coordinates
                itemOffSet = (nextX - itemX) / 2 - bnds.width / 2;

                // Set X Position
                item.style.left = centerX + itemX + itemOffSet + 'px';

                // Set Y Position
                switch (this._align) {
                    case 'TOP':
                        yCoord = 0;
                        break;
                    case 'CENTER':
                        yCoord = (this.source.offsetHeight - bnds.height) / 2;
                        break;
                    case 'BOTTOM':
                        yCoord = this.source.offsetHeight - bnds.height;
                        break;
                }
                item.style.top = yCoord + 'px';

                // Set alpha/visibility
                itemAlpha = Math.sin(itemRad + radian);
                if (this.autoAlpha) cv.setStyle(item, 'opacity', itemAlpha);
                //item.style.visibility = (itemAlpha <= 0) ? "hidden" : "visible";

                closestCenter = closestBounds.left + closestBounds.width / 2;
                if (item.style.visiblity == 'visible') {
                    if (this._abs(itemCenter - centerX) < this._abs(closestCenter - centerX)) {
                        // Find Center Item
                        closestItem = item;
                        closestBounds = bnds;
                        closestIndex = i;
                    } else if (closestItem.style.visiblity == 'hidden') {
                        // If the closest item is no longer visible, let it be overridden by an item that is visible
                        closestItem = item;
                        closestBounds = bnds;
                        closestIndex = i;
                        i = this.items.length;
                    }
                }
            }
        }

        this._selectedPrevious = this._selected;
        this._selected = closestItem; // null if i <= 0
        this._index = closestIndex; // NaN if i <= 0
    },
};
