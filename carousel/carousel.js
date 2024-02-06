var car;
/*$(function() {
	var btnNext = $("btnNext");
	var btnPrev = $("btnPrev");
	car = new cv.controls.Carousel($("#carousel1")[0]);
	$(car.source).change(onChange);
	$('#btnNext').click(onNext);
	$('#btnPrev').click(onPrev);
	console.log('asdf');
});*/

cv.onDOMReady(function () {
    var btnNext = $('btnNext');
    var btnPrev = $('btnPrev');
    car = new cv.controls.Carousel($('carousel1'));
    cv.addEventListener(car.source, 'change', onChange);
    cv.addEventListener($('btnNext'), 'click', onNext);
    cv.addEventListener($('btnPrev'), 'click', onPrev);
});

function onChange(changeEvent) {
    //console.log('change');
}

function onNext(clickEvent) {
    car.next();
}

function onPrev(clickEvent) {
    car.previous();
}
