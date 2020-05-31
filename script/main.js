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
    searchFormInput = document.querySelector('.search__form-input'),
    preloading = document.querySelector('.preloader'),
    dropdown = document.querySelectorAll('.dropdown'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    modalContent = document.querySelector('.modal__content'),
    pagination = document.querySelector('.pagination');

let startPage = 1;
let endPage = 10;

// лоадер для карточек
const loading = document.createElement('div');
loading.className = 'loading';

class DBService {

    constructor() {
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = 'd43b7e4b242967ed78b052591bfb1107';
        this.temp;
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
        this.temp = this.SERVER + '/search/tv?api_key=' + this.API_KEY + '&language=ru-RU&query=' + query;
        return this.getData(this.temp);
    }

    getNextPage = page => {
        return this.getData(this.temp + '&page=' + page);
    }

    getTvShow = id => {
        return this.getData(this.SERVER + '/tv/' + id + '?api_key=' + this.API_KEY + '&language=ru-RU');
    }

    getTrendingToday = () => {
        this.temp = `${this.SERVER}/trending/tv/day?api_key=${this.API_KEY}&language=ru-RU`;
        return this.getData(this.temp);
    }

    getTrendingWeek = () => this.getData(`${this.SERVER}/trending/tv/week?api_key=${this.API_KEY}&language=ru-RU`);

    getTopRated = () => this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);

    getPopular = () => this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);

    getAiringToday = () => this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);

    getOnTheAir = () => this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
}

const dbService = new DBService();

// создание карточек с сериалами

const renderCard = (response, target) => {
    tvShowsList.textContent = '';
    pagination.textContent = '';

    if (!response.total_results) {
        loading.remove();
        tvShowsHead.textContent = 'По вашему запросу сериалов не найдено :(';
        tvShowsHead.style.color = 'tomato';
        return;
    }

    if (response.total_pages > 1) {
        const maxPage = response.total_pages <= endPage ? response.total_pages : endPage;
        if (startPage === 1) {
            pagination.innerHTML += `<li class="pagination__item"><button class="pagination__button pagination__button--prev" type="button" disabled><i class="fas fa-chevron-left"></i></button>
            </li>`;
        } else {
            pagination.innerHTML += `<li class="pagination__item"><button class="pagination__button pagination__button--prev" type="button"><i class="fas fa-chevron-left"></i></button>
            </li>`;
        }
        for (let i = startPage; i <= maxPage; i++) {
            if (target) {
                if (i.toString() === target) {
                    pagination.innerHTML += `<li class="pagination__item"><a class="pagination__link pagination__link--current">${i}</a>
                    </li>`;
                } else {
                    pagination.innerHTML += `<li class="pagination__item"><a class="pagination__link" href="#">${i}</a></li>`;
                }
            } else {
                if (i === startPage) {
                    pagination.innerHTML += `<li class="pagination__item"><a class="pagination__link pagination__link--current">${i}</a>
                    </li>`;
                } else {
                    pagination.innerHTML += `<li class="pagination__item"><a class="pagination__link" href="#">${i}</a></li>`;
                }
            }
        }
        if (response.total_pages <= endPage) {
            pagination.innerHTML += `<li class="pagination__item"><button class="pagination__button pagination__button--next" type="button" disabled><i class="fas fa-chevron-right"></i></button>
            </li>`;
        } else {
            pagination.innerHTML += `<li class="pagination__item"><button class="pagination__button pagination__button--next" type="button"><i class="fas fa-chevron-right"></i></button>
            </li>`;
        }
        const btnPrev = document.querySelector('.pagination__button--prev'),
            btnNext = document.querySelector('.pagination__button--next');

        btnPrev.addEventListener('click', () => {
            if (!btnPrev.disabled) {
                startPage -= 10;
                endPage -= 10;
                dbService.getNextPage(startPage).then((response) => renderCard(response, startPage.toString()));
            }
        });
        
        btnNext.addEventListener('click', () => {
            if (!btnNext.disabled) {
                startPage += 10;
                endPage += 10;
                dbService.getNextPage(startPage).then((response) => renderCard(response, startPage.toString()));
            }
        });
    }

    // tvShowsHead.textContent = target ? target : 'Результат поиска';
    // tvShowsHead.style.color = 'black';

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
}

// поиск сериалов

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    searchFormInput.value = '';
    if (value) {
        tvShows.append(loading);
        dbService.getSearchResult(value).then(renderCard);
    }
});

// открытие и закрытие меню

const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    });
};

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
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

    if (target.closest('#top-rated')) {
        tvShows.append(loading);
        dbService.getTopRated().then((response) => renderCard(response, target));
        return;
    }

    if (target.closest('#popular')) {
        tvShows.append(loading);
        dbService.getPopular().then((response) => renderCard(response, target));
        return;
    }

    if (target.closest('#today-trend')) {
        tvShows.append(loading);
        dbService.getTrendingToday().then((response) => renderCard(response, target));
        return;
    }

    if (target.closest('#week-trend')) {
        tvShows.append(loading);
        dbService.getTrendingWeek().then((response) => renderCard(response, target));
        return;
    }

    if (target.closest('#today')) {
        tvShows.append(loading);
        dbService.getAiringToday().then((response) => renderCard(response, target));
        return;
    }

    if (target.closest('#week')) {
        tvShows.append(loading);
        dbService.getOnTheAir().then((response) => renderCard(response, target));
        return;
    }

    if (target.closest('#search')) {
        tvShowsList.textContent = '';
        tvShowsHead.textContent = 'Начните поиск новых сериалов';
        searchFormInput.focus();
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
        return;
    }
});

// открытие модального окна

tvShowsList.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {
        preloading.style.display = 'block';

        dbService.getTvShow(card.id)
            .then(({
                poster_path: posterPath,
                name: title,
                genres,
                vote_average: voteAverage,
                overview,
                homepage
            }) => {
                const voteNum = voteAverage ? voteAverage : '-';
                const overviewText = overview ? overview : '-';

                if (posterPath) {
                    tvCardImg.parentElement.removeAttribute('style');
                    modalContent.removeAttribute('style');
                    tvCardImg.src = IMG_URL + posterPath;
                    tvCardImg.alt = title;
                } else {
                    tvCardImg.parentElement.style.display = 'none';
                    modalContent.style.paddingLeft = '25px';
                }

                modalTitle.textContent = title;
                genresList.innerHTML = genres.reduce((acc, item) => `${acc}<li>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</li>`, '');
                rating.textContent = voteNum;
                description.textContent = overviewText;
                modalLink.href = homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            .finally(() => {
                preloading.style.display = '';
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

pagination.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('pagination__link')) {
        tvShows.append(loading);
        dbService.getNextPage(target.textContent).then((response) => renderCard(response, target.textContent));
    }
});
