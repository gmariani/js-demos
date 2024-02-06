cv.onDOMReady(init);

function init(event) {
    var box = $('box');
    box.style.left = '50px';
    box.style.top = '50px';
    //box.style.opacity = 0.5;
    //TweenLite.to(box, 0.5, {left:100, units:"px"}); // Works
    //TweenLite.to(box, 0.5, {left:100, units:"px", visibility:'hidden'}); // Works
    //TweenLite.to(box, 0.5, {autoOpacity:0});
    TweenLite.to(box, 0.5, { opacity: 0 }); // Works
}
