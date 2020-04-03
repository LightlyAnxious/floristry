(function() {
  'use strict';

  // * Переключение меню
  var openBtn = document.querySelector('.page-header__btn');
  var closeBtn = document.querySelector('.menu__btn');
  var menuOverlay = document.querySelector('.menu-overlay');
  var modal = document.querySelector('.modal');
  var modalOverlay = document.querySelector('.modal-overlay');
  var servicesList = document.querySelector('.services__list');
  var callButton = document.querySelector('#call-button');
  var modalClose = document.querySelector('.contact-form__button');
  const desktop = window.matchMedia('(min-width: 1140px)');
  var winX = null, winY = null;

  // * Функция открытия модального окна

  var openModal = function (el) {
    el.classList.add('modal--open');
    modalOverlay.style.display = "block";
    disableWindowScroll();
  }

  // * Функция блокировки скролла

  window.addEventListener('scroll', function () {
    if (winX !== null && winY !== null) {
        window.scrollTo(winX, winY);
    }
  });

  function disableWindowScroll() {
    winX = window.scrollX;
    winY = window.scrollY;
  };

  function enableWindowScroll() {
    winX = null;
    winY = null;
  };

  // * Переключение меню

  if (openBtn && closeBtn && menuOverlay) {
    openBtn.addEventListener('click', function() {
      menuOverlay.classList.toggle('open');
      // * Ограничение табуляции модальных окон
      trapFocus(menuOverlay);
      disableWindowScroll();
    });
    closeBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      menuOverlay.classList.toggle('open');
      trapFocus(menuOverlay).release();
      enableWindowScroll();
    });
  }

  // * Вызов и закрытие модального окна

  callButton.addEventListener('click', () => openModal(modal));
  modalClose.addEventListener('click', function () {
    modal.classList.remove('modal--open');
    modalOverlay.style.display = "none";
    callButton.removeEventListener('click', () => openModal(modal))
    enableWindowScroll();
  });

  modalOverlay.addEventListener('click', function () {
    modal.classList.remove('modal--open');
    modalOverlay.style.display = "none";
    callButton.removeEventListener('click', () => openModal(modal))
    enableWindowScroll();
  });

  if (callButton && modal && modalClose && modalOverlay) {
    callButton.addEventListener('click', () => openModal(modal));
    modalClose.addEventListener('click', function () {
      modal.classList.remove('open');
      callButton.removeEventListener('click', () => openModal(modal))
      enableWindowScroll();
    });
    modalOverlay.addEventListener('click', function() {
      modal.classList.remove('modal--open');
      callButton.removeEventListener('click', () => openModal(modal))
      enableWindowScroll();
    });
  }

  // * Инициализация плагина Yall

  document.addEventListener("DOMContentLoaded", yall);

  // * Инициализация слайдера для блока ‘Услуги‘

  let servicesSlider;

  const breakpointChecker = function() {

    if (desktop.matches === true) {

      if (servicesSlider !== undefined && servicesList) servicesSlider.destroy(true, true);

      return;

    } else if (desktop.matches === false) {

      return enableSwiper();

    }

  };

  const enableSwiper = function() {
    servicesSlider = new Swiper('.swiper-container', {


      breakpoints: {
        250: {
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            bulletElement: 'button',
          },

          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 28,
          initialSlide: 0,

          setWrapperSize: true,
          a11y: true,
          keyboardControl: true,
          grabCursor: true,
          updateOnWindowResize: true,
          centeredSlides: true,
          centeredSlidesBounds: true
        },

        768: {
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            bulletElement: 'button',
            clickable: true
          },

          slidesPerView: 2,
          slidesPerGroup: 2,
          // spaceBetween: 28,
          initialSlide: 0,
          setWrapperSize: true,
          a11y: true,
          keyboardControl: true,
          grabCursor: true,
          updateOnWindowResize: true,
          cssWidthAndHeight: true,
        }
      },
    });
  };

  desktop.addListener(breakpointChecker);

  breakpointChecker();

})();
