cv.onDOMReady(init);

function init(event) {
    var slider1, slider2;
    slider1 = new cv.controls.Slider($('slider1'), { hideInput: true, tween: true, tweenUpdate: true, jump: true, arrows: true });
    slider1.addCallBack('change', onChange);

    slider2 = new cv.controls.Slider($('slider2'), { hideInput: true, tween: true, jump: true, tweenUpdate: true, snap: true, min: 0, max: 6 });

    cv.addEventListener(document, 'mousemove', docMoveHandler);
}

function onChange(changeEvent) {
    $('sliderPercent').value = (changeEvent.percent * 100).toFixed(1) + '%';
}

function docMoveHandler(mouseEvent) {
    $('xCoord').value = mouseEvent.pageX;
    $('yCoord').value = mouseEvent.pageY;
    return false;
}
