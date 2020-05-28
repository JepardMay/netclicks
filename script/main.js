// элементы

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input'),preloading = document.querySelector('.preloader');;

// лоадер для карточек
const loading = document.createElement('div');
loading.className = 'loading';
    
class DBService {

    constructor() {
        this.SERVER = 'https://api.themoviedb.org/3';  
        this.API_KEY = 'd43b7e4b242967ed78b052591bfb1107';
    }

    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Ошибка ${res.status}
                Не удалось получить данные по адресу ${url}`);
        }
    }

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = query => {
        return this.getData(this.SERVER + '/search/tv?api_key=' + this.API_KEY + '&language=ru-RU&query=' + query);
    }

    getTvShow = id => {
        return this.getData(this.SERVER + '/tv/' + id + '?api_key=' + this.API_KEY + '&language=ru-RU');
    }
}

// создание карточек с сериалами

const renderCard = response => {
    if (response.results.length > 0) {
        tvShowsList.textContent = '';
        
        response.results.forEach(item => {
            const {
                backdrop_path: backdrop, 
                name: title, 
                poster_path: poster, 
                vote_average: vote,
                id
            } = item;
    
            const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
            const backdropIMG = backdrop ? IMG_URL + backdrop : '';
            const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';
            const card = document.createElement('li');
            card.className = 'tv-shows__item';
            card.innerHTML = `
                <a href="#" id="${id}" class="tv-card">
                    ${voteElem}
                    <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${backdropIMG}"
                        alt="${title}">
                    <h4 class="tv-card__head">${title}</h4>
                </a>
            `;
            
            loading.remove();
            tvShowsList.append(card);
        });
    } else {
        tvShowsList.textContent = '';
        const noResults = document.createElement('p');
        noResults.textContent = 'По вашему запросу сериалов не найдено';
        loading.remove();
        tvShowsList.insertAdjacentElement('beforebegin', noResults);
    }
}

// поиск сериалов

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    searchFormInput.value = '';
    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
});

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
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
        
    }
});

// открытие модального окна

tvShowsList.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {
        preloading.style.display = 'initial';
        new DBService().getTvShow(card.id)
            .then(({ poster_path: posterPath,
                    name: title,
                    genres, 
                    vote_average: voteAverage, 
                    overview, 
                    homepage 
                }) => {
                const posterIMG = posterPath ? IMG_URL + posterPath : false;
                const voteNum = voteAverage ? voteAverage : '-';
                const overviewText = overview ? overview : '-';
                
                if (posterIMG) {
                    tvCardImg.parentElement.removeAttribute('style');
                    tvCardImg.src = posterIMG;
                    tvCardImg.alt = title;
                } else {
                    tvCardImg.parentElement.style.display = 'none';
                }
                
                modalTitle.textContent = title;
                genresList.innerHTML = genres.reduce((acc, item) => `${acc}<li>${item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}</li>`, '');
                rating.textContent = voteNum;
                description.textContent = overviewText;
                modalLink.href = homepage;
            })
            .then(() => {
                preloading.style.display = '';
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
    }
});

// закрытие модального окна

modal.addEventListener('click', event => {
    if (event.target.closest('.cross') ||   
        event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

// смена карточки

const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }
    }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);
