'use strict';
// * Переключение меню
var openBtn = document.querySelector('.page-header__btn');
var closeBtn = document.querySelector('.menu__btn');
var overlay = document.querySelector('.overlay');

if (openBtn && closeBtn && overlay) {
  openBtn.addEventListener('click', function () {
    overlay.classList.toggle('open');
    // * Ограничение табуляции модальных окон
    trapFocus(overlay);
  });
  closeBtn.addEventListener('click', function () {
    overlay.classList.toggle('open');
    trapFocus(overlay).release();
  });
}

document.addEventListener("DOMContentLoaded", yall);
