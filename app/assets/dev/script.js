document.addEventListener('DOMContentLoaded', function () {
    var PAUSE = 'remote-control__button_pause';
    var ACTIVE_CLASS = 'slider__item_active';
    var iframeNode = document.querySelector('.js-iframe');
    var iframeWindow = iframeNode.contentWindow;
    var playNode = document.querySelector('.js-play');
    var forwardNode = document.querySelector('.js-forward');
    var backwardNode = document.querySelector('.js-backward');
    var counterNode = document.querySelector('.js-current-slide');
    var originalSetTimeout = iframeWindow.setTimeout.bind(iframeWindow);
    var isOnPause = false;
    var activeIndex = 0;
    var task;

    iframeWindow.setTimeout = function(fn, delay) {
        task = fn;
        if (!isOnPause) {
            originalSetTimeout(function() {
                if (!isOnPause) {
                    task();
                }
            }, delay);
        }
    };

    playNode.addEventListener('click', function () {
        setPause(!isOnPause);
    });

    forwardNode.addEventListener('click', function () {
        setPause(true);
        changeSlide('forward');
    });

    backwardNode.addEventListener('click', function () {
        setPause(true);
        changeSlide();
    });

    function setPause(status) {
        isOnPause = status;
        playNode.classList.toggle(PAUSE, isOnPause);
        if (!isOnPause) task();
    }

    function changeSlide(direction) {
        var slideNodesList = Array.prototype.slice.apply(iframeNode.contentWindow.document.querySelectorAll('.slider__item'));
        var dir = direction === 'forward' ? 1 : -1;

        slideNodesList[activeIndex].classList.remove(ACTIVE_CLASS);
        activeIndex = (activeIndex + dir + slideNodesList.length) % slideNodesList.length;
        slideNodesList[activeIndex].classList.add(ACTIVE_CLASS);
        counterNode.innerHTML = activeIndex + 1;
    }
});

