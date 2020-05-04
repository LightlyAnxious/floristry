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
const introBg =document.querySelector(".intro__bg-image");
const desktop = window.matchMedia("(min-width: 1140px)");
let winX = null, winY = null;

const onEscEvent = function (evt, action) {
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

// * Инициализация плагина Yall

document.addEventListener("DOMContentLoaded", yall);

// * Функция блокировки скролла

window.addEventListener("scroll", function () {
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

if (menuBtn && menuOverlay) {
  const onClickMenuToggle = () => {
    menuBtn.classList.toggle("page-header__btn--close");
    menuBtn.classList.toggle("page-header__btn--open");
    menuOverlay.classList.toggle("menu-overlay--shown")
      if (menuOverlay.classList.contains("menu-overlay--shown")) {
        disableWindowScroll();
        focusManager.capture(menuOverlay);
      } else {
        enableWindowScroll();
        focusManager.release(menuOverlay);
      }
    }

    const closeMenu = () => {
      if (menuOverlay.classList.contains("menu-overlay--shown")) {
        menuOverlay.classList.remove("menu-overlay--shown");
        menuBtn.classList.toggle("page-header__btn--close");
        menuBtn.classList.toggle("page-header__btn--open");
      }
    }

    menuBtn.addEventListener("click", (onClickMenuToggle));
    window.addEventListener("keydown", (evt) => {
      onEscEvent(evt, closeMenu);
    });
  }

  // * Intro bg parallax
  if (introBg !== null) {
    window.addEventListener("scroll", () => {
      let value = window.scrollY;

      introBg.style.top = value * 0.5 + "px";
    });
  }


// * Вызов и закрытие модального окна
if (callButton && modal && modalClose && modalOverlay) {

  // * Функция открытия модального окна

  const openModal = function (el) {
    el.classList.add("modal--open");
    el.setAttribute("aria-modal", true);
    el.removeAttribute("aria-hidden");
    modalOverlay.style.display = "block";
    disableWindowScroll();
    focusManager.capture(contactForm);
  };

  const closeModal = () => {
    if (modal.classList.contains("modal--open")) {
      modal.classList.remove("modal--open");
      modal.removeAttribute("aria-modal");
      modal.setAttribute("aria-hidden", true);
      callButton.removeEventListener("click", () => openModal(modal));
      enableWindowScroll();
      focusManager.release(callButton);
    }

    if (modalOverlay) {
      modalOverlay.style.display = "none";
    }
  }

  // Обработчики действий модального окна

  callButton.addEventListener("click", () => openModal(modal));

  modalClose.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", closeModal);

  window.addEventListener("keydown", (evt) => {
    onEscEvent(evt, closeModal);
  });
}

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
  // setWrapperSize: true,
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

const getPreviousControl = () => {
const prevBtn = document.querySelector(".card__control--prev");

  if (prevBtn && cardsSlider && cardsSlider.realIndex > 3) {
    prevBtn.style.display = "block";
  }

  if (prevBtn && cardsSlider && cardsSlider.realIndex <= 3) {
    prevBtn.style.display = "none";
  }
};

cardsSlider.on('slideChange', getPreviousControl);
