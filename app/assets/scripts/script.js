document.addEventListener('DOMContentLoaded', function () {
    var DELAY = 2000;
    var ACTIVE_CLASS = 'slider__item_active';

    var slideNodesList = Array.from(document.querySelectorAll('.slider__item'));
    var activeIndex = 0;

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

    autoPlay();
});

