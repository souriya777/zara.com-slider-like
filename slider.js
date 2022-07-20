window.onload = function () {
  (function () {
    if (!document.querySelector(".zara-slider__images")) {
      return;
    }

    console.log("souriya-zara-slider.js 😎");

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
    // FIXME INTENSE
    // const MEDIAS = document.querySelectorAll('.zara-slider__images img');
    const THUMBNAIL_BUTTONS = document.querySelectorAll(
      ".zara-slider__thumbnails button"
    );
    const PROGRESS_BAR = document.querySelector(".zara-slider__progress-bar");
    const PROGRESS = document.querySelector(".zara-slider__progress");
    const TOTAL = document.querySelector(".zara-slider__images > ul")
      .childElementCount;

    let currentSlide = 1;
    let pressed = false;
    let hasMove = false;
    let isUp;
    let touchstartY = 0
    let touchendY = 0

    // FUNCTIONS
    function init() {
      updateSlider();
      // FIXME INTENSE
      // Intense(MEDIAS);
    }

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

    // EVENTS  CLICK
    for (let i = 0; i < THUMBNAIL_BUTTONS.length; i++) {
      const button = THUMBNAIL_BUTTONS[i];
      button.addEventListener("click", () => {
        currentSlide = parseInt(button.dataset.slideNumber);
        updateSlider();
      });
    }

    // EVENTS MOUSE
    IMAGES.addEventListener("wheel", (e) => {
      throttle(() => moveSlide(e), 1600);
      e.preventDefault();
    }, false);


    IMAGES.addEventListener("mouseenter", () => {
      IMAGES.style.cursor = "grab";
    });

    IMAGES.addEventListener('mousedown', () => {
      pressed = true;
      IMAGES.style.cursor = "grabbing";
    });

    IMAGES.addEventListener("mouseup", () => {
      IMAGES.style.cursor = "grab";
      pressed = false;

      if ((currentSlide === 1 && !isUp) || (currentSlide === TOTAL && isUp)) {
        return;
      }

      if (hasMove) {
        // FIXME INTENSE
        // console.log('mouseup intense', '🛑', currentSlide, isUp);
        // MEDIAS.forEach(elt => {
        //   elt.addEventListener('click', stopIntense, true);
        // });

        currentSlide = isUp ? currentSlide + 1 : currentSlide - 1;
        updateSlider();
      } else {
        // FIXME INTENSE
        // console.log('mouseup intense', '✅');
        // MEDIAS.forEach(elt => {
        //   elt.removeEventListener('click', stopIntense);
        // });
      }
    });

    IMAGES.addEventListener("mousemove", (e) => {
      if (!pressed) return;
      e.preventDefault();
      hasMove = true;
      isUp = (e.movementY < 0 && e.movementX == 0) ? true : false;
    });

    // MOBILE TOUCH
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

    // EVENTS RESIZE
    window.addEventListener('resize', () => {
      debounce(updateSlider, 500);
    });

    // INIT
    init();

  })();
};
