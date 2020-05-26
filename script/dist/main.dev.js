"use strict";

// меню
var leftMenu = document.querySelector('.left-menu');
var hamburger = document.querySelector('.hamburger');
var cards = document.querySelectorAll('.tv-shows__item'); // открытие и закрытие меню

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
});
cards.forEach(function (card) {
  var img = card.querySelector('img');
  var src = img.getAttribute('src');
  var backDrop = img.getAttribute('data-backdrop');

  if (backDrop !== "") {
    card.addEventListener('mouseenter', function () {
      img.setAttribute('src', backDrop);
    });
    card.addEventListener('mouseout', function () {
      img.setAttribute('src', src);
    });
  }
});