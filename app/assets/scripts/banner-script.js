document.addEventListener('DOMContentLoaded', function () {
    var DELAY = document.querySelector('.slider').dataset.animationDelay || 3000;
    var ACTIVE_CLASS = 'slider__item_active';

    var slideNodesList = Array.prototype.slice.apply(document.querySelectorAll('.slider__item'));
    var userAgent = window.navigator.userAgent;
    var activeIndex = 0;

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        document.querySelector('.app-links-ios').addEventListener('click', function (event) {
            event.preventDefault();
            window.parent.location = this.getAttribute('href');
        })
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

    autoPlay();
});

