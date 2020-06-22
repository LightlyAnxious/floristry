import Masonry from 'masonry-layout';
import yall from 'yall-js';
import { debounce } from './utils.js';

const msnryGrid = document.querySelector('.grid');

// ! Инициализация Masonry и Yall

if (msnryGrid) {
  const grid = document.querySelector('.grid');

  let msnry = new Masonry(grid, {
    columnWidth: '.grid-sizer',
    itemSelector: '.grid-item',
    percentPosition: true,
    transitionDuration: '0.2s'
  });

  let doMasonry = debounce(function() {
    msnry.layout();
  }, 250);

  document.addEventListener('DOMContentLoaded', () =>
    yall({
      events: {
        load: function(event) {
          if (event.target.classList.contains('gallery__image--unloaded')) {
            doMasonry();
          }
        }
      },
      options: {
        once: true
      }
    })
  );
} else {
  document.addEventListener('DOMContentLoaded', () =>
    yall({
      observeChanges: true,
      noPolyfill: true
    })
  );
}
