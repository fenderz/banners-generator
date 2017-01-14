document.addEventListener('DOMContentLoaded', function () {
    var iframeNode = document.querySelector('.js-iframe');
    var iframeWindow = iframeNode.contentWindow;

    iframeWindow.document.addEventListener('DOMContentLoaded', function () {
        var PAUSE = 'remote-control__button_pause';
        var ACTIVE_CLASS = 'slider__item_active';
        var playNode = document.querySelector('.js-play');
        var forwardNode = document.querySelector('.js-forward');
        var backwardNode = document.querySelector('.js-backward');
        var counterNode = document.querySelector('.js-slide-index');
        var slideNodesList = Array.prototype.slice.apply(iframeWindow.document.querySelectorAll('.slider__item'));
        var originalSetTimeout = iframeWindow.setTimeout.bind(iframeWindow);
        var isOnPause = false;
        var task;

        iframeWindow.setTimeout = function (fn, delay) {
            task = fn;
            if (!isOnPause) {
                originalSetTimeout(function () {
                    if (!isOnPause) {
                        executeTask()
                    }
                }, delay);
            }
        };

        setPause(true);
        setDisplaySlideIndex(getActiveSlideIndex());

        playNode.addEventListener('click', function () {
            setPause(!isOnPause);
        });

        forwardNode.addEventListener('click', function () {
            changeSlide('forward');
        });

        backwardNode.addEventListener('click', changeSlide);

        function executeTask() {
            task();
            setDisplaySlideIndex(getActiveSlideIndex());
        }

        function setDisplaySlideIndex(index) {
            counterNode.innerHTML = index + 1;
        }

        function getActiveSlideIndex() {
            var elemNode = slideNodesList.find(function (elemNode) {
                return elemNode.classList.contains(ACTIVE_CLASS);
            });
            return slideNodesList.indexOf(elemNode);
        }

        function setPause(status) {
            isOnPause = status;
            playNode.classList.toggle(PAUSE, isOnPause);
            if (!isOnPause) {
                executeTask();
            }
        }

        function changeSlide(direction) {
            setPause(true);
            var dir = direction === 'forward' ? 1 : -1;
            var activeIndex = getActiveSlideIndex();
            slideNodesList[activeIndex].classList.remove(ACTIVE_CLASS);
            activeIndex = (activeIndex + dir + slideNodesList.length) % slideNodesList.length;
            slideNodesList[activeIndex].classList.add(ACTIVE_CLASS);
            setDisplaySlideIndex(activeIndex);
        }
    });
});

