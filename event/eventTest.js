trace = function() {
	try {
		console.log.apply(console.log, arguments);
	} catch(e) {
		try {
			firebug.d.console.cmd.log.apply(console.log, arguments);
		} catch(e) {
		alert(arguments);
			var str = "", i;
			for(i in arguments) { str += " " + arguments[i]; alert(i); };
			alert(str);
		}
	}
};

function domEventsLinkFir2Function2(e) {
	trace(e, e.screenX, e.screenY, window.screenX, window.screenY);
	//alert('Event fired : ' + e.type + ' : ' + e.target);
}

function init() {
	var div = document.body;
	div.onabort = function(){};
	div.onchange = function(){};
	if(div.attachEvent) {
		/*div.attachEvent("onabort", domEventsLinkFir2Function2);
		div.attachEvent("onblur", domEventsLinkFir2Function2);
		div.attachEvent("onchange", domEventsLinkFir2Function2);
		div.attachEvent("ondblclick", domEventsLinkFir2Function2);
		div.attachEvent("onerror", domEventsLinkFir2Function2);
		div.attachEvent("onfocus", domEventsLinkFir2Function2);
		div.attachEvent("onkeydown", domEventsLinkFir2Function2);
		div.attachEvent("onkeyup", domEventsLinkFir2Function2);
		div.attachEvent("onload", domEventsLinkFir2Function2);*/
		div.attachEvent("onmousedown", domEventsLinkFir2Function2);
		/*div.attachEvent("onmousemove", domEventsLinkFir2Function2);
		div.attachEvent("onmouseout", domEventsLinkFir2Function2);
		div.attachEvent("onmouseover", domEventsLinkFir2Function2);
		div.attachEvent("onmouseup", domEventsLinkFir2Function2);
		div.attachEvent("onreset", domEventsLinkFir2Function2);
		div.attachEvent("onresize", domEventsLinkFir2Function2);
		div.attachEvent("onselect", domEventsLinkFir2Function2);
		div.attachEvent("onsubmit", domEventsLinkFir2Function2);
		div.attachEvent("onunload", domEventsLinkFir2Function2);*/
	} else {
		div.addEventListener("abort", domEventsLinkFir2Function2, false);
		div.addEventListener("blur", domEventsLinkFir2Function2, false);
		/*div.addEventListener("change", domEventsLinkFir2Function2, false);
		div.addEventListener("dblclick", domEventsLinkFir2Function2, false);
		div.addEventListener("error", domEventsLinkFir2Function2, false);
		div.addEventListener("focus", domEventsLinkFir2Function2, false);*/
		div.addEventListener("keydown", domEventsLinkFir2Function2, false);
		/*div.addEventListener("keyup", domEventsLinkFir2Function2, false);
		div.addEventListener("load", domEventsLinkFir2Function2, false);*/
		div.addEventListener("mousedown", domEventsLinkFir2Function2, false);
		/*div.addEventListener("mousemove", domEventsLinkFir2Function2, false);
		div.addEventListener("mouseout", domEventsLinkFir2Function2, false);
		div.addEventListener("mouseover", domEventsLinkFir2Function2, false);
		div.addEventListener("mouseup", domEventsLinkFir2Function2, false);
		div.addEventListener("reset", domEventsLinkFir2Function2, false);
		div.addEventListener("resize", domEventsLinkFir2Function2, false);
		div.addEventListener("select", domEventsLinkFir2Function2, false);
		div.addEventListener("submit", domEventsLinkFir2Function2, false);
		div.addEventListener("unload", domEventsLinkFir2Function2, false);*/
	}

	if(document.createEventObject) {
		var evt = document.createEventObject();
		/*try { div.fireEvent("onabort", evt); } catch(e) {}
		try { div.fireEvent("onblur", evt); } catch(e) {} //
		try { div.fireEvent("onchange", evt); } catch(e) {}
		try { div.fireEvent("ondblclick", evt); } catch(e) {} //
		try { div.fireEvent("onerror", evt); } catch(e) {}
		try { div.fireEvent("onfocus", evt); } catch(e) {} //
		try { div.fireEvent("onkeydown", evt); } catch(e) {} //
		try { div.fireEvent("onkeyup", evt); } catch(e) {} //
		try { div.fireEvent("onload", evt); } catch(e) {}*/
		try { div.fireEvent("onmousedown", evt); } catch(e) {} //
		/*try { div.fireEvent("onmousemove", evt); } catch(e) {} //
		try { div.fireEvent("onmouseout", evt); } catch(e) {} //
		try { div.fireEvent("onmouseover", evt); } catch(e) {} //
		try { div.fireEvent("onmouseup", evt); } catch(e) {} //
		try { div.fireEvent("onreset", evt); } catch(e) {}
		try { div.fireEvent("onresize", evt); } catch(e) {} //
		try { div.fireEvent("onselect", evt); } catch(e) {}
		try { div.fireEvent("onsubmit", evt); } catch(e) {}
		try { div.fireEvent("onunload", evt); } catch(e) {}*/
	} else {
		// All work (ff, chrome, safari)
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("abort", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("UIEvents");
		evt.initEvent("blur", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("Events");
		evt.initEvent("change", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("dblclick", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("error", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("focus", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("KeyboardEvent");
		evt.initEvent("keydown", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("KeyboardEvent");
		evt.initEvent("keyup", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("load", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("mousedown", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("MouseEvents");
		evt.initEvent("mousemove", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("MouseEvents");
		evt.initEvent("mouseout", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("MouseEvents");
		evt.initEvent("mouseover", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("MouseEvents");
		evt.initEvent("mouseup", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("reset", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("resize", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("select", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("submit", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("unload", true, true );
        div.dispatchEvent(evt);
	}
	
	var evt = document.createEvent("HTMLEvents");
		evt.initEvent("abort", true, true );
        div.dispatchEvent(evt);
		
		var evt = document.createEvent("UIEvents");
		evt.initEvent("blur", true, true );
        div.dispatchEvent(evt);
}