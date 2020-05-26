// меню

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
let cards = document.querySelectorAll('.tv-shows__item');

// открытие и закрытие меню

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

cards.forEach((card) => {
    let img = card.querySelector('img');
    let src = img.getAttribute('src');
    let backDrop = img.getAttribute('data-backdrop');

    if (backDrop !== "") {
        card.addEventListener('mouseenter', () => {
            img.setAttribute('src', backDrop);
        });

        card.addEventListener('mouseout', () => {
            img.setAttribute('src', src);
        });
    }
});