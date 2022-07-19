window.onload = function () {
  (function () {
    console.debug("souriya-zara-slider.js 😎");

    // UTILS
    let throttlePause;

    function throttle(callback, time) {
      if (throttlePause) return;

      throttlePause = true;
      callback();

      setTimeout(() => {
        throttlePause = false;
      }, time);
    }

    let debounceTimer;

    function debounce(callback, time) {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(callback, time);
    }

    // VARIABLES
    const IMAGES = document.querySelector(".zara-slider__images");
    const THUMBNAIL_BUTTONS = document.querySelectorAll(
      ".zara-slider__thumbnails button"
    );
    const PROGRESS_BAR = document.querySelector(".zara-slider__progress-bar");
    const PROGRESS = document.querySelector(".zara-slider__progress");
    const TOTAL = document.querySelector(".zara-slider__images > ul")
      .childElementCount;

    let currentSlide = 1;

    // FUNCTIONS
    function getProgressStep() {
      return PROGRESS.clientHeight / TOTAL;
    }

    function updateSliderSlide() {
      IMAGES.style.transform = `translateY(-${(currentSlide - 1) * IMAGES.clientHeight
        }px)`;
    }

    function updateSliderProgress() {
      PROGRESS_BAR.style.height = `${getProgressStep() * currentSlide}px`;
    }

    function updateSlider() {
      updateSliderSlide();
      updateSliderProgress()
    }

    function moveSlide(e) {
      const dir = Math.sign(e.deltaY);
      const isNext = dir > 0;
      if (
        (currentSlide === 1 && !isNext) ||
        (currentSlide === TOTAL && isNext)
      ) {
        return false;
      }

      currentSlide = isNext ? currentSlide + 1 : currentSlide - 1;
      updateSlider();
    }

    // EVENTS
    window.addEventListener('resize', () => {
      debounce(updateSlider, 500);
    });

    for (let i = 0; i < THUMBNAIL_BUTTONS.length; i++) {
      const button = THUMBNAIL_BUTTONS[i];

      button.addEventListener("click", () => {
        // FIXME closure
        currentSlide = parseInt(button.dataset.slideNumber);
        console.log('click thumbnails', currentSlide);
        updateSlider();
      });
    }

    IMAGES.addEventListener("wheel", (e) => {
      throttle(() => moveSlide(e), 1600);
      e.preventDefault();
    }, false);

    // INIT
    updateSlider();

    const INNER_SLIDER = document.querySelector(".zara-slider__images ul");
    let pressed = false;
    let startY;
    let y;
    let initialY;
    let isUp;
    IMAGES.addEventListener('mousedown', (e) => {
      console.log('mousedown');
      pressed = true;
      startY = e.offsetY - INNER_SLIDER.offsetTop;
      IMAGES.style.cursor = "grabbing";
    });
    IMAGES.addEventListener("mouseenter", (e) => {
      initialY = e.clientY;
      // console.log('mouseenter', initialY);
      IMAGES.style.cursor = "grab";
    });
    IMAGES.addEventListener("mouseup", () => {
      console.log('mouseup', 'isUp', isUp);
      IMAGES.style.cursor = "grab";
      pressed = false;

      currentSlide = isUp ? currentSlide + 1 : currentSlide - 1;
      updateSlider();
    });
    IMAGES.addEventListener("mousemove", (e) => {
      if (!pressed) return;
      e.preventDefault();
      y = e.offsetY;
      if (e.movementY > 0 && e.movementX == 0) {
        isUp = false;
      } else if (e.movementY < 0 && e.movementX == 0) {
        isUp = true;
        y *= -1;
      }
      console.log('mousemove', isUp, initialY, y, y - initialY);
      //IMAGES.style.transform = `translateY(${y-initialY}px)`;
    });


    //////
    // TODO
    // click GIANT

    let touchstartY = 0
    let touchendY = 0

    function isTouchUp() {
      return (touchendY < touchstartY) ? true : false;
    }

    document.addEventListener('touchstart', e => {
      touchstartY = e.changedTouches[0].screenY
    })

    document.addEventListener('touchend', e => {
      touchendY = e.changedTouches[0].screenY

      currentSlide = isTouchUp() ? currentSlide + 1 : currentSlide - 1;
      updateSlider();
    })
  })();
};
