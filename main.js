import "normalize.css"
import './main.scss'
import './slider.scss'
import './slider.js'

window.addEventListener('load', function () {
  let elements = document.querySelectorAll('.zara-slider__images img');
  Intense(elements);
});