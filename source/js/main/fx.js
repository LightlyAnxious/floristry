const introBg = document.querySelector('.intro__bg-image');

// * Функция создания эффекта parallax

const createParallax = el => {
  if (el !== null) {
    window.addEventListener('scroll', () => {
      let value = window.scrollY;

      el.style.top = value * 0.5 + 'px';
    });

    return el;
  }
};

// * Добавление эффекта parallax для блока intro

createParallax(introBg);
