/*
Script: Request.js
	Handles cross-browser and simplified XHR request

	Thanks mootools 1.2.3

License:
	MIT-style license.
*/

var cv = cv || {};

cv.Request = function (options) {
    // Init callbacks
    for (var i = 0, l = this.eventList.length; i < l; i++) {
        this._callbacks[this.eventList[i]] = [];
    }

    this.xhr = new XMLHttpRequest();
    this.headers = options.headers || this.headers;
};

//--------------------------------------
//  Static Vars
//--------------------------------------

cv.Request.VERSION = 1.0;

cv.Request.prototype = {
    //--------------------------------------
    //  Public Vars
    //--------------------------------------

    // Options
    options: {
        url: '',
        data: '', // Data to be sent to server
        user: null,
        pass: null,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'text/javascript, text/html, application/xml, text/xml, */*',
        },
        async: true,
        urlEncoded: true,
        encoding: 'utf-8',
        noCache: false,
        method: 'POST', // 'GET', 'POST', 'PUT', 'DELETE', 'HEAD'
        contentType: null,
    },

    _callbacks: {},
    eventList: ['focus', 'blur', 'change', 'init', 'destroy'],
    running: false,
    response: null, // Data recieved from server
    status: null,

    //--------------------------------------
    //  Public Methods
    //--------------------------------------

    setHeader: function (name, value) {
        this.headers[name] = value;
        return this;
    },

    getHeader: function (name) {
        try {
            return this.xhr.getResponseHeader(name);
        } catch (err) {
            return this.headers[name] || null;
        }
    },

    cancel: function () {
        if (!this.running) {
            return this;
        }
        this.running = false;
        this.status = null;
        this.xhr.abort();
        this.xhr.onreadystatechange = null;
        this.xhr = new XMLHttpRequest();
        this.callBack('cancel');
        return this;
    },

    send: function (options) {
        if (this.running) {
            return;
        }
        this.running = true;

        if (typeof options === 'string' || typeof options === 'element') {
            options = { data: options };
        }

        options.data = options.data || this.options.data;
        options.url = options.method || this.options.url;
        options.method = options.method || this.options.method;
        options.user = options.user || this.options.user;
        options.pass = options.pass || this.options.pass;

        var data = options.data,
            url = options.url,
            user = options.user,
            pass = options.pass,
            method = options.method.toUpperCase(),
            encoding,
            noCache,
            i,
            trimPosition = url.lastIndexOf('/');

        if (this.options.urlEncoded && method === 'POST') {
            encoding = this.options.encoding ? '; charset=' + this.options.encoding : '';
            this.headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
        }

        if (this.options.noCache) {
            noCache = 'noCache=' + new Date().getTime();
            data = data ? noCache + '&' + data : noCache;
        }

        if (trimPosition > -1 && (trimPosition = url.indexOf('#')) > -1) {
            url = url.substr(0, trimPosition);
        }

        if (data && method === 'GET') {
            url = url + (url.contains('?') ? '&' : '?') + data;
            data = null;
        }

        //open(method, url, async, user, password)
        this.xhr.open(method, url, this.options.async, user, pass);

        this.xhr.onreadystatechange = this.onStateChange;

        if (this.options.contentType) {
            if (this.xhr.overrideMimeType) {
                // Others
                this.xhr.overrideMimeType(this.options.contentType);
            } else if (this.xhr.contentType) {
                // IE 8
                this.xhr.contentType = this.options.contentType;
            }
        }

        for (i in this.headers) {
            try {
                this.xhr.setRequestHeader(i, this.headers[i]);
            } catch (err) {
                //i, this.headers[i]
                //this.fireEvent('exception', [key, value]);
            }
        }

        this.xhr.send(data);
        if (!this.options.async) {
            this.onStateChange();
        }

        return this;
    },

    onStateChange: function () {
        switch (this.xhr.readyState) {
            case 0:
                // UNINITIALIZED 	open() has not been called yet.
                break;
            case 1:
                // LOADING 	send() has not been called yet.
                break;
            case 2:
                // LOADED 	send() has been called, and headers and status are available.
                this.status = this.xhr.status || 0;
                this.callBack('status');
                break;
            case 3:
                // INTERACTIVE 	Downloading; responseText holds partial data.
                this.callBack('progress');
                break;
            case 4:
                //  	COMPLETED 	The operation is complete.
                this.xhr.onreadystatechange = null;
                if (this.xhr.status === 200) {
                    this.response = { text: this.xhr.responseText, xml: this.xhr.responseXML };
                    this.callBack('complete');
                } else {
                    this.response = { text: null, xml: null };
                    this.callBack('error');
                }
                break;
        }
    },

    callBack: function (type) {
        var i,
            f,
            e = {
                text: this.response.text,
                xml: this.response.xml,
                status: this.status,
            };

        try {
            for (i = 0; (f = this._callbacks[type][i]); i++) {
                f(e);
            }
        } catch (err) {
            trace('Request::callBack :', err);
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
