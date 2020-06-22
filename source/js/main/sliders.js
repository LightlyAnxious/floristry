import Swiper from 'swiper';
import { modalOverlay } from './nav.js';
import { breakpointChecker, manageControls } from './utils';

const desktop = window.matchMedia('(min-width: 1140px)');
const servicesList = document.querySelector('.services__list');
const cardSlides = document.querySelectorAll('.card__slide');
const modal = document.querySelector('.modal');
const galleryImages = document.querySelectorAll('.gallery__item');
const modalSlider = document.querySelector('.modal-slider');
const galleryCloseBtn = document.querySelector('.modal-slider__close-btn');

let slideTemplate = document.querySelector('#modal-slider-template');

// * Опции слайдеров

const servicesSliderOptions = {
  a11y: true,
  paginationBulletMessage: 'Перейти к слайду {{index}}',
  updateOnWindowResize: true,

  breakpoints: {
    250: {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function(index, className) {
          return (
            '<button class="' +
            className +
            '" aria-label= "' +
            'Перейти к слайду ' +
            index +
            '">' +
            'Перейти к слайду ' +
            index +
            '</button>'
          );
        }
      },

      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 28,
      initialSlide: 0,
      setWrapperSize: true,
      grabCursor: true,
      updateOnWindowResize: true,
      centeredSlides: true,
      centeredSlidesBounds: true
    },

    768: {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function(index, className) {
          return (
            '<button class="' +
            className +
            '" aria-label= "' +
            'Перейти к слайду ' +
            index +
            '">' +
            'Перейти к слайду ' +
            index +
            '</button>'
          );
        }
      },

      slidesPerView: 2,
      slidesPerGroup: 2,
      initialSlide: 0,
      setWrapperSize: true,
      grabCursor: true,
      updateOnWindowResize: true,
      cssWidthAndHeight: true
    }
  }
};

const cardsSliderOptions = {
  slidesPerView: 4,
  slidesPerGroup: 4,
  initialSlide: 0,
  spaceBetween: 20,
  a11y: true,
  paginationBulletMessage: 'Перейти к слайду {{index}}',
  keyboardControl: true,
  grabCursor: true,
  updateOnWindowResize: true,
  navigation: {
    nextEl: '.card__control--next',
    prevEl: '.card__control--prev'
  },
  // cssWidthAndHeight: true,

  breakpoints: {
    250: {
      spaceBetween: 15,
      initialSlide: 0,
      keyboardControl: true,
      grabCursor: true,
      updateOnWindowResize: true
    },

    384: {
      initialSlide: 0,
      on: {
        beforeResize() {
          if (window.innerWidth >= 384) {
            cardsSlider.slides.css('width', '');
          }
        }
      }
    },

    768: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      initialSlide: 0,
      spaceBetween: 23,
      setWrapperSize: true,
      keyboardControl: true,
      grabCursor: true,
      updateOnWindowResize: true,
      cssWidthAndHeight: true
    },

    1141: {
      spaceBetween: 9
    },

    1300: {
      spaceBetween: 12
    },

    1500: {
      spaceBetween: 16
    }
  }
};

const modalSliderOptions = {
  slidesPerView: 1,
  slidesPerGroup: 1,
  a11y: true,
  initialSlide: 0,
  observer: true,
  updateOnWindowResize: true,
  navigation: {
    nextEl: '.modal-btn--next',
    prevEl: '.modal-btn--prev'
  },
  fadeEffect: {
    crossFade: true
  }
};

// ! Инициализация слайдера для блока ‘Услуги‘

let servicesSlider;

const enableServicesSlider = () => {
  servicesSlider = new Swiper('.swiper1', servicesSliderOptions);

  return servicesSlider;
};

const disableServicesSlider = () => {
  if (servicesSlider !== undefined) servicesSlider.destroy(true, true);

  return;
};

// * Функция инициализации слайдера блока "Услуги" для разных разрешений

const servicesSliderChecker = () =>
  breakpointChecker(
    desktop,
    servicesList,
    disableServicesSlider,
    enableServicesSlider
  );

if (servicesList) {
  desktop.addListener(servicesSliderChecker);

  servicesSliderChecker();
}

// ! Инициализация слайдера карточек услуг

const cardsSlider = new Swiper('.swiper2', cardsSliderOptions);

// * Обработчик смены слайдов

cardsSlider.on('slideChange', () =>
  manageControls(
    '.card__control--prev',
    '.card__control--next',
    cardsSlider,
    cardsSlider.realIndex,
    cardSlides.length
  )
);

// ! Инициализация модального слайдера

const gallerySlider = new Swiper('.swiper3', modalSliderOptions);

// ! Добавление слайдов

const NUMBER_OF_SLIDES = 8;

if (modal && galleryImages && modalSlider) {
  let galleryList = document.querySelector('.swiper-wrapper');

  if (slideTemplate) {
    const images = Array.from(galleryImages);
    let srcSet;
    let src;

    // * Функция создания слайда

    const getLazySlide = index => {
      let slideElement = slideTemplate.content
        .querySelector('.modal-slider__picture')
        .cloneNode(true);
      let slideSource = slideElement.querySelector('source');
      let slideImg = slideElement.querySelector('img');
      let viewPort = window.innerWidth;
      let galleryItem = document.createElement('li');

      galleryItem.classList.add('modal-slider__item');
      galleryItem.classList.add('swiper-slide');

      if (viewPort > TABLET) {
        srcSet = `img/gallery/tablet/gallery-img-${index}--tablet.webp 1x, img/gallery/tablet/gallery-img-${index}--tablet@2x.webp 2x`;

        src = `img/gallery/tablet/gallery-img-${index}--tablet.jpg`;

        slideSource.dataset.srcset = srcSet;
        slideImg.dataset.src = src;
        galleryItem.appendChild(slideElement);

        galleryList.appendChild(galleryItem);
      } else {
        srcSet = `img/gallery/mobile/gallery-img-${index}--mobile.webp 1x, img/gallery/mobile/gallery-img-${index}--mobile@2x.webp 2x`;

        src = `img/gallery/mobile/gallery-img-${index}--mobile.jpg`;

        slideSource.dataset.srcset = srcSet;
        slideImg.dataset.src = src;
        galleryItem.appendChild(slideElement);

        galleryList.appendChild(galleryItem);
      }
    };

    // * Функция обработчик смены слайдов

    const onClickRenderSlides = (index, slider) => {
      let clearSlides = () => (galleryList.innerHTML = '');

      clearSlides();

      for (let i = 1; i <= NUMBER_OF_SLIDES; i++) {
        getLazySlide(i);
      }

      slider.update();
      slider.slideTo(index - 1);
    };

    // * Обработка действий по нажатию на изображения

    images.forEach((galleryToggle, index) => {
      galleryToggle.addEventListener('click', evt => {
        let pictureWrap = evt.target.lastElementChild;
        let imgSrc = pictureWrap.lastElementChild.src;
        let matches = imgSrc.match(/\d+/g);

        onClickRenderSlides(matches[1], gallerySlider);
        openModal(modal, modalSlider);

        manageControls(
          '.modal-btn--prev',
          '.modal-btn--next',
          gallerySlider,
          gallerySlider.realIndex,
          galleryImages.length
        );

        yall();
      });
    });

    galleryCloseBtn.addEventListener('click', () => closeModal(modal, window));
    modalOverlay.addEventListener('click', () => closeModal(modal, window));

    gallerySlider.on('slideChange', () => {
      manageControls(
        '.modal-btn--prev',
        '.modal-btn--next',
        gallerySlider,
        gallerySlider.realIndex,
        NUMBER_OF_SLIDES
      );
    });
  }
}
