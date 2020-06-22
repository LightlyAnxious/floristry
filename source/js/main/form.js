import { modalOverlay, closeModal } from './nav.js';
import { ESC_KEYCODE } from './utils.js';

const modal = document.querySelector('.modal');
const contactFields = document.querySelector('.contact-form__fields');
const contactSubmit = document.querySelector('.contact-form__submit');

// ! Обработка отправки формы

if (modal && contactSubmit && contactFields) {
  const contactForm = document.querySelector('#contact-form');
  const modalSuccess = document.querySelector('.modal-success');

  function onSubmitFormSend(evt) {
    evt.preventDefault();
    closeModal(modal, window);
    modalOverlay.style.display = 'block';
    modalSuccess.style.display = 'block';

    setTimeout(() => {
      modalOverlay.style.display = 'none';
      modalSuccess.style.display = 'none';
    }, 5000);

    modalOverlay.addEventListener(
      'click',
      () => (modalSuccess.style.display = 'none')
    );

    window.addEventListener('keydown', evt => {
      if (evt.keyCode === ESC_KEYCODE) {
        modalOverlay.style.display = 'none';
        modalSuccess.style.display = 'none';
      }
    });
  }

  contactForm.addEventListener('submit', evt => onSubmitFormSend(evt));
}
