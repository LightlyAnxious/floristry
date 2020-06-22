const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;
let winX = null,
  winY = null;

// * Функция блокировки скролла

window.addEventListener('scroll', function() {
  if (winX !== null && winY !== null) {
    window.scrollTo(winX, winY);
  }
});

function disableWindowScroll() {
  winX = window.scrollX;
  winY = window.scrollY;
}

function enableWindowScroll() {
  winX = null;
  winY = null;
}

// * Функция проверки медиа запросов

const breakpointChecker = function(media, el, disableCallback, enableCallback) {
  if (media.matches === true) {
    if (el !== undefined) disableCallback();

    return;
  } else if (media.matches === false) {
    return enableCallback();
  }
};

// * Функция обработки нажатия esc

const onEscEvent = function(evt, action) {
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

// * Debounce

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this,
      args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// * Функция отображения кнопок слайдера

const manageControls = (
  prevCssClass,
  nextCssClass,
  currentSlider,
  index,
  length
) => {
  const prevBtn = document.querySelector(prevCssClass);
  const nextBtn = document.querySelector(nextCssClass);

  if (prevBtn && currentSlider && index > 0) {
    prevBtn.style.display = 'block';
    nextBtn.style.display = 'block';
  }

  if (prevBtn && currentSlider && index === 0) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'block';
  }

  if (prevBtn && currentSlider && index === length - 1) {
    nextBtn.style.display = 'none';
  }
};

export {
  ESC_KEYCODE,
  ENTER_KEYCODE,
  disableWindowScroll,
  enableWindowScroll,
  breakpointChecker,
  onEscEvent,
  debounce,
  manageControls
};
