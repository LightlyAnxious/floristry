import focusManager from 'focus-manager';
import {
  disableWindowScroll,
  enableWindowScroll,
  onEscEvent
} from './utils.js';

const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.contact-form__close');
const menuBtn = document.querySelector('.page-header__btn');
const callButton = document.querySelector('#call-button');
const menuOverlay = document.querySelector('.menu-overlay');
const menuContainer = document.querySelector('.menu__container');
const contactFields = document.querySelector('.contact-form__fields');

// ! Переключение меню

if (menuBtn && menuOverlay) {
  const onClickMenuToggle = () => {
    menuBtn.classList.toggle('page-header__btn--close');
    menuBtn.classList.toggle('page-header__btn--open');
    menuOverlay.classList.toggle('menu-overlay--shown');
    if (menuOverlay.classList.contains('menu-overlay--shown')) {
      disableWindowScroll();
      focusManager.capture(menuContainer);
    } else {
      enableWindowScroll();
      focusManager.release(menuContainer);
    }
  };

  const closeMenu = () => {
    if (menuOverlay.classList.contains('menu-overlay--shown')) {
      menuOverlay.classList.remove('menu-overlay--shown');
      menuBtn.classList.toggle('page-header__btn--close');
      menuBtn.classList.toggle('page-header__btn--open');
      if (menuOverlay.classList.contains('menu-overlay--shown')) {
        disableWindowScroll();
        focusManager.capture(menuContainer);
      } else {
        enableWindowScroll();
        focusManager.release(menuContainer);
      }
    }
  };

  menuBtn.addEventListener('click', onClickMenuToggle);
  window.addEventListener('keydown', evt => {
    onEscEvent(evt, closeMenu);
  });
}

// !  Навигация модального окна

const openModal = (el, capture) => {
  el.classList.add('modal--open');
  el.setAttribute('aria-modal', true);
  el.removeAttribute('aria-hidden');
  if (modalOverlay) {
    modalOverlay.style.display = 'block';
  }
  disableWindowScroll();
  focusManager.capture(capture);
};

const closeModal = (el, capture) => {
  if (el.classList.contains('modal--open')) {
    el.classList.remove('modal--open');
    el.removeAttribute('aria-modal');
    el.setAttribute('aria-hidden', true);
    enableWindowScroll();
    focusManager.release(capture);
  }

  if (modalOverlay) {
    modalOverlay.style.display = 'none';
  }
};

// ! Вызов и закрытие модального окна
if (callButton && modal && modalClose && modalOverlay) {
  // Обработчики действий модального окна

  callButton.addEventListener('click', () => openModal(modal, contactFields));

  modalClose.addEventListener('click', () => closeModal(modal, callButton));

  modalOverlay.addEventListener('click', () => closeModal(modal, callButton));

  window.addEventListener('keydown', evt => {
    onEscEvent(evt, () => closeModal(modal, callButton));
  });
}

export { modalOverlay, closeModal, openModal };
