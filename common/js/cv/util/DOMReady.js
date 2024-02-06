var cv = cv || {};

// Thanks YUI 3 b1
cv.onDOMReady = function (fn, ctx) {
    var timer,
        fireDOMReady = function () {
            //Call the onload function in given context or window object
            fn.call(ctx || window);
            //Clean up after the DOM is ready
            if (document.removeEventListener) {
                document.removeEventListener('DOMContentLoaded', fireDOMReady, false);
            }
        },
        // IE
        checkDOM = function () {
            try {
                document.documentElement.doScroll('left');
                clearInterval(timer);
                timer = null;
                fireDOMReady();
            } catch (e) {}
        };

    // IE
    if (!document.addEventListener) {
        timer = setInterval(checkDOM, 5);
        // FireFox, Opera, Safari 3+
    } else {
        document.addEventListener('DOMContentLoaded', fireDOMReady, false);
    }
};
