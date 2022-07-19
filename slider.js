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

    // VARIABLES
    const IMAGES = document.querySelector(".zara-slider__images");
    const IMAGES_HEIGHT = IMAGES.clientHeight;
    const THUMBNAIL_BUTTONS = document.querySelectorAll(
      ".zara-slider__thumbnails button"
    );
    const PROGRESS_BAR = document.querySelector(".zara-slider__progress-bar");
    const PROGRESS_HEIGHT = document.querySelector(".zara-slider__progress")
      .clientHeight;
    const TOTAL = document.querySelector(".zara-slider__images > ul")
      .childElementCount;
    const progressStep = PROGRESS_HEIGHT / TOTAL;

    let currentSlide = 1;

    // FUNCTIONS
    function updateSlider(slideNumber) {
      IMAGES.style.transform = `translateY(-${(slideNumber - 1) * IMAGES_HEIGHT
        }px)`;
    }

    function updateSliderProgress(slideNumber) {
      PROGRESS_BAR.style.height = `${progressStep * slideNumber}px`;
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
      updateSlider(currentSlide);
      updateSliderProgress(currentSlide);
    }

    // EVENTS
    IMAGES.addEventListener(
      "wheel",
      (e) => {
        throttle(() => moveSlide(e), 1600);
        e.preventDefault();
      },
      false
    );

    for (let i = 0; i < THUMBNAIL_BUTTONS.length; i++) {
      const button = THUMBNAIL_BUTTONS[i];

      button.addEventListener("click", () => {
        currentSlide = parseInt(button.dataset.slideNumber);
        updateSlider(currentSlide);
        updateSliderProgress(currentSlide);
      });
    }

    // INIT
    updateSliderProgress(currentSlide);

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
      console.log('mouseenter', initialY);
      IMAGES.style.cursor = "grab";
    });
    IMAGES.addEventListener("mouseup", () => {
      console.log('mouseup', 'isUp', isUp);
      IMAGES.style.cursor = "grab";
      pressed = false;

      currentSlide = isUp ? currentSlide + 1 : currentSlide - 1;
      updateSlider(currentSlide);
      updateSliderProgress(currentSlide);
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
  })();
};
