"use strict";

// меню
var leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'); // открытие и закрытие меню

hamburger.addEventListener('click', function () {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});
document.addEventListener('click', function (event) {
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});
leftMenu.addEventListener('click', function (event) {
  var target = event.target;
  var dropdown = target.closest('.dropdown');

  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
}); // открытие модального окна

tvShowsList.addEventListener('click', function (event) {
  event.preventDefault();
  var target = event.target;
  var card = target.closest('.tv-card');

  if (card) {
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hide');
  }
}); // закрытие модального окна

modal.addEventListener('click', function (event) {
  if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
}); // смена карточки

var changeImage = function changeImage(event) {
  var card = event.target.closest('.tv-shows__item');

  if (card) {
    var img = card.querySelector('.tv-card__img');

    if (img.dataset.backdrop) {
      var _ref = [img.dataset.backdrop, img.src];
      img.src = _ref[0];
      img.dataset.backdrop = _ref[1];
    }
  }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);