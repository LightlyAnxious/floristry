const DESKTOP = 1140;
const TABLET = 767;
const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;
const menuBtn = document.querySelector(".page-header__btn");
const menuOverlay = document.querySelector(".menu-overlay");
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");
const contactForm = document.querySelector(".contact-form__fields");
const servicesList = document.querySelector(".services__list");
const callButton = document.querySelector("#call-button");
const modalClose = document.querySelector(".contact-form__close");
const introBg = document.querySelector(".intro__bg-image");
const galleryImages = document.querySelectorAll(".gallery__item");
const cardSlides = document.querySelectorAll(".card__slide");
const modalSlider = document.querySelector(".modal-slider");
const galleryCloseBtn = document.querySelector(".modal-slider__close-btn");
const desktop = window.matchMedia("(min-width: 1140px)");
const msnryGrid = document.querySelector(".grid");
let slideTemplate = document.querySelector("#modal-slider-template");
let winX = null,
  winY = null;
let step = 1;

// * Функция обработки нажатия esc

const onEscEvent = function (evt, action) {
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

// ! Функция открытия модального окна

const openModal = (el, capture) => {
  el.classList.add("modal--open");
  el.setAttribute("aria-modal", true);
  el.removeAttribute("aria-hidden");
  if (modalOverlay) {
    modalOverlay.style.display = "block";
  }
  disableWindowScroll();
  focusManager.capture(capture);
};

const closeModal = (el, capture) => {
  if (el.classList.contains("modal--open")) {
    el.classList.remove("modal--open");
    el.removeAttribute("aria-modal");
    el.setAttribute("aria-hidden", true);
    enableWindowScroll();
    focusManager.release(capture);
  }

  if (modalOverlay) {
    modalOverlay.style.display = "none";
  }
};

// ! Функция блокировки скролла

window.addEventListener("scroll", function () {
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

// ! Инициализация Masonry и Yall

if (msnryGrid) {
  const grid = document.querySelector(".grid");

  let msnry = new Masonry(grid, {
    columnWidth: ".grid-sizer",
    itemSelector: ".grid-item",
    percentPosition: true,
    transitionDuration: "0.2s"
  });

  function doMasonry() {
    msnry.layout();
  };

  document.addEventListener("DOMContentLoaded", () =>
    yall({
      events: {
        load: function (event) {
          if (event.target.classList.contains("gallery__image--unloaded")) {
            event.target.classList.remove("gallery__image--unloaded");
            window.setTimeout(doMasonry, 300);
          }
        }
      },
      options: {
        once: true,
      }
    })
  );
} else {

  document.addEventListener("DOMContentLoaded", () =>
    yall({
      observeChanges: true,
      noPolyfill: true,
    })
  );
}

// ! Переключение меню

if (menuBtn && menuOverlay) {
  const onClickMenuToggle = () => {
    menuBtn.classList.toggle("page-header__btn--close");
    menuBtn.classList.toggle("page-header__btn--open");
    menuOverlay.classList.toggle("menu-overlay--shown");
    if (menuOverlay.classList.contains("menu-overlay--shown")) {
      disableWindowScroll();
      focusManager.capture(menuOverlay);
    } else {
      enableWindowScroll();
      focusManager.release(menuOverlay);
    }
  };

  const closeMenu = () => {
    if (menuOverlay.classList.contains("menu-overlay--shown")) {
      menuOverlay.classList.remove("menu-overlay--shown");
      menuBtn.classList.toggle("page-header__btn--close");
      menuBtn.classList.toggle("page-header__btn--open");
    }
  };

  menuBtn.addEventListener("click", onClickMenuToggle);
  window.addEventListener("keydown", (evt) => {
    onEscEvent(evt, closeMenu);
  });
}

// ! Intro bg parallax
if (introBg !== null) {
  window.addEventListener("scroll", () => {
    let value = window.scrollY;

    introBg.style.top = value * 0.5 + "px";
  });
}

// ! Вызов и закрытие модального окна
if (callButton && modal && modalClose && modalOverlay) {
  // Обработчики действий модального окна

  callButton.addEventListener("click", () => openModal(modal, contactForm));

  modalClose.addEventListener("click", () => closeModal(modal, callButton));

  modalOverlay.addEventListener("click", () => closeModal(modal, callButton));

  window.addEventListener("keydown", (evt) => {
    onEscEvent(evt, closeModal(modal, callButton));
  });
}

// ! Функция отображения кнопки слайдера

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
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
  }

  if (prevBtn && currentSlider && index === 0) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "block";
  }

  if (prevBtn && currentSlider && index === length - 1) {
    nextBtn.style.display = "none";
  }
};

// ! Инициализация слайдера для блока ‘Услуги‘

let servicesSlider;

const breakpointChecker = function () {
  if (desktop.matches === true) {
    if (servicesSlider !== undefined && servicesList)
      servicesSlider.destroy(true, true);

    return;
  } else if (desktop.matches === false) {
    return enableSwiper();
  }
};

const enableSwiper = function () {
  servicesSlider = new Swiper(".swiper1", {
    a11y: true,
    paginationBulletMessage: "Перейти к слайду {{index}}",

    breakpoints: {
      250: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            return (
              '<button class="' +
              className +
              '" aria-label= "' +
              "Перейти к слайду " +
              index +
              '">' +
              "Перейти к слайду " +
              index +
              "</button>"
            );
          },
        },

        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 28,
        initialSlide: 0,
        setWrapperSize: true,
        grabCursor: true,
        updateOnWindowResize: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      },

      768: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            return (
              '<button class="' +
              className +
              '" aria-label= "' +
              "Перейти к слайду " +
              index +
              '">' +
              "Перейти к слайду " +
              index +
              "</button>"
            );
          },
        },

        slidesPerView: 2,
        slidesPerGroup: 2,
        initialSlide: 0,
        setWrapperSize: true,
        grabCursor: true,
        updateOnWindowResize: true,
        cssWidthAndHeight: true,
      },
    },
  });
};

desktop.addListener(breakpointChecker);

breakpointChecker();

// ! Инициализация слайдера карточек услуг

let cardsSlider = new Swiper(".swiper2", {
  slidesPerView: 4,
  slidesPerGroup: 4,
  initialSlide: 0,
  spaceBetween: 20,
  a11y: true,
  paginationBulletMessage: "Перейти к слайду {{index}}",
  keyboardControl: true,
  grabCursor: true,
  updateOnWindowResize: true,
  navigation: {
    nextEl: ".card__control--next",
    prevEl: ".card__control--prev",
  },
  // cssWidthAndHeight: true,

  breakpoints: {
    250: {
      spaceBetween: 15,
      initialSlide: 0,
      keyboardControl: true,
      grabCursor: true,
      updateOnWindowResize: true,
    },

    384: {
      initialSlide: 0,
      on: {
        beforeResize() {
          if (window.innerWidth >= 384) {
            cardsSlider.slides.css("width", "");
          }
        },
      },
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
      cssWidthAndHeight: true,
    },

    1141: {
      spaceBetween: 9,
    },

    1300: {
      spaceBetween: 12,
    },

    1500: {
      spaceBetween: 16,
    },
  },
});

// * Обработчик смены слайдов

cardsSlider.on("slideChange", () =>
  manageControls(
    ".card__control--prev",
    ".card__control--next",
    cardsSlider,
    cardsSlider.realIndex,
    cardSlides.length
  )
);

// ! Инициализация модального слайдера

let modalSliderOptions = {
  slidesPerView: 1,
  slidesPerGroup: 1,
  a11y: true,
  initialSlide: 0,
  observer: true,
  updateOnWindowResize: true,
  navigation: {
    nextEl: ".modal-btn--next",
    prevEl: ".modal-btn--prev",
  },
  fadeEffect: {
    crossFade: true,
  },
};

const gallerySlider = new Swiper(".swiper3", modalSliderOptions);

// ! Добавление слайдов

if (modal && galleryImages && modalSlider) {
  let galleryList = document.querySelector(".swiper-wrapper");

  if (slideTemplate) {
    const images = Array.from(galleryImages);
    let srcSet;
    let src;

    // * Функция создания слайда

    const getLazySlide = (index) => {
      let slideElement = slideTemplate.content
        .querySelector(".modal-slider__picture")
        .cloneNode(true);
      let slideSource = slideElement.querySelector("source");
      let slideImg = slideElement.querySelector("img");
      let viewPort = window.innerWidth;
      let galleryItem = document.createElement("li");

      galleryItem.classList.add("modal-slider__item");
      galleryItem.classList.add("swiper-slide");

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
      let clearSlides = () => (galleryList.innerHTML = "");

      clearSlides();

      for (let i = 1; i <= galleryImages.length; i++) {
        getLazySlide(i);
      }

      slider.update();
      slider.slideTo(index);
    };

    // * Обработка действий по нажатию на изображения

    images.forEach((galleryToggle, index) => {
      galleryToggle.addEventListener("click", () => {
        onClickRenderSlides(index, gallerySlider);
        openModal(modal, modalSlider);

        manageControls(
          ".modal-btn--prev",
          ".modal-btn--next",
          gallerySlider,
          gallerySlider.realIndex,
          galleryImages.length
        );

        yall();
      });
    });

    galleryCloseBtn.addEventListener("click", () => closeModal(modal, window));
    modalOverlay.addEventListener("click", () => closeModal(modal, window));

    gallerySlider.on("slideChange", () => {
      manageControls(
        ".modal-btn--prev",
        ".modal-btn--next",
        gallerySlider,
        gallerySlider.realIndex,
        galleryImages.length
      );
    });
  }
}
