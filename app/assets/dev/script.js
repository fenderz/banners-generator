const PAUSE = 'remote-control__button_pause';
const ACTIVE_CLASS = 'slider__item_active';
const NOTICE = 'notice_show';
const POLLING_INTERVAL = 500;
const BANNER_URL = 'banner.html?slider-debug';

class BannerFrame {
    constructor(containerNode, url, sliderCallback, sliderTimeout) {
        containerNode.innerHtml = '';
        this.containerNode = containerNode;
        this.node = document.createElement('iframe');
        this.node.setAttribute('src', '');
        this.containerNode.appendChild(this.node);
        this.node.setAttribute('frameborder', '0');
        this.node.setAttribute('style', 'width: 100%; height: 100%');
        this.sliderCallback = sliderCallback;
        this.sliderTaskId = 0;
        this.sliderTimeout = sliderTimeout;
        this.beforeUpdate();
        this.node.setAttribute('src', url);
    }

    beforeUpdate() {
        this.document = null;
        this.slides = Array.prototype;
        this.loadPromise = new Promise((resolve, reject) => {
            this.node.onload = () => {
                this.window = this.node.contentWindow;
                this.document = this.window.document;
                this.slides = Array.from(this.document.querySelectorAll('.slider__item'));
                resolve(this);
            };
            this.node.onerror = reject
        });
        return this.loadPromise;
    }

    reload() {
        this.beforeUpdate();
        this.window.location.reload();
        return this.loadPromise;
    }

    executeSlider() {
        this.sliderTaskId && clearTimeout(this.sliderTaskId);
        this.sliderTaskId = setTimeout(() => {
            this.sliderTaskId = 0;
            this.nextSlide();
            this.executeSlider()
        }, this.sliderTimeout)
    }

    togglePause(pause = Boolean(this.sliderTaskId)) {
        if (pause) {
            this.sliderTaskId && clearTimeout(this.sliderTaskId);
            this.sliderTaskId = 0;
        } else {
            this.nextSlide();
            this.executeSlider();
        }
        return pause;
    }

    getActiveSlideIndex() {
        const elemNode = this.slides.find(elemNode => elemNode.classList.contains(ACTIVE_CLASS));
        return this.slides.indexOf(elemNode);
    }

    setActiveSlide(index, current = this.getActiveSlideIndex()) {
        current >= 0 && this.slides[current].classList.remove(ACTIVE_CLASS);
        index >= 0 && this.slides[index].classList.add(ACTIVE_CLASS);
        this.sliderCallback();
    }

    nextSlide(back) {
        const delta = back ? -1 : 1;
        const activeIndex = this.getActiveSlideIndex();
        const nextIndex = (activeIndex + delta + this.slides.length) % this.slides.length;
        this.setActiveSlide(nextIndex, activeIndex);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let fileModificationTime = 0;
    const sliderTimeout = document.body.dataset.animationDelay || 3000;

    const containerNode = document.querySelector('.js-container');
    const playNode = document.querySelector('.js-play');
    const forwardNode = document.querySelector('.js-forward');
    const backwardNode = document.querySelector('.js-backward');
    const counterNode = document.querySelector('.js-slide-index');
    const noticeNode = document.querySelector('.js-notice');

    const bannerFrame = new BannerFrame(
        containerNode,
        BANNER_URL,
        () => setDisplaySlideIndex(bannerFrame.getActiveSlideIndex()),
        sliderTimeout
    );

    bannerFrame.loadPromise.then(() => {
        checkBannerUpdate();
        updatePauseButton(true);
    });

    playNode.addEventListener('click', () => updatePauseButton(bannerFrame.togglePause()));

    forwardNode.addEventListener('click', () => {
        bannerFrame.togglePause(true);
        bannerFrame.nextSlide();
        updatePauseButton(true);
    });

    backwardNode.addEventListener('click', () => {
        bannerFrame.togglePause(true);
        bannerFrame.nextSlide(true);
        updatePauseButton(true);
    });

    function updatePauseButton(onPause) {
        playNode.classList.toggle(PAUSE, onPause);
    }

    function setDisplaySlideIndex(index) {
        counterNode.innerHTML = index + 1;
    }

    function updateBannerFrame(slideIndex) {
        return bannerFrame.reload().then(() => {
            bannerFrame.setActiveSlide(slideIndex);
        });
    }

    function displayNotification() {
        noticeNode.classList.add(NOTICE);
        setTimeout(() => noticeNode.classList.remove(NOTICE), 1000);
        console.log('Reload');
    }

    function checkBannerUpdate() {
        fetch('update').then(x => x.json())
            .then(time => {
                if (fileModificationTime !== 0
                    && fileModificationTime !== time
                    && bannerFrame) {
                    const slideIndex = bannerFrame.getActiveSlideIndex();
                    updateBannerFrame(slideIndex).then(displayNotification);
                }
                fileModificationTime = time;
                setTimeout(checkBannerUpdate, POLLING_INTERVAL);
            })
            .catch(error => {
                console.error(error);
                setTimeout(checkBannerUpdate, POLLING_INTERVAL);
            });
    }
});
