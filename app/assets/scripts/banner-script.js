document.addEventListener('DOMContentLoaded', function () {
    var DELAY = document.body.dataset.animationDelay || 3000;
    var ACTIVE_CLASS = 'slider__item_active';
    var slideNodesList = Array.prototype.slice.apply(document.querySelectorAll('.slider__item'));
    var activeIndex = 0;

    if (location.href.indexOf('?slider-debug') === -1) {
        autoPlay();
    }

    function changeSlide() {
        slideNodesList[activeIndex].classList.remove(ACTIVE_CLASS);
        activeIndex = (activeIndex + 1) % slideNodesList.length;
        slideNodesList[activeIndex].classList.add(ACTIVE_CLASS);
    }

    function autoPlay() {
        setTimeout(function () {
            changeSlide();
            autoPlay();
        }, DELAY);
    }
});

