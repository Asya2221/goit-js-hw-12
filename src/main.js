import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import { getImagesByQuery } from './js/pixabay-api.js';

const form = document.querySelector('.form');
const input = document.querySelector('[name="search-text"]');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const btnLoadMore = document.querySelector('.js-load-more');

let page = 1;
let query = '';
let totalShow = 0;

form.addEventListener('submit', handleSubmit);

btnLoadMore.addEventListener('click', handleClick);

function handleSubmit(event) {
  event.preventDefault();

  query = input.value.trim().toLowerCase(); // Взяти текст з input і привести до нижнього регістру
  page = 1;
  totalShow = 0;

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    return;
  }

  clearGallery(); // Очистити старі картинки
  showLoader(); // Показати індикатор завантаження

  getImagesByQuery(query, page)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          title: '',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
        return;
      }

      createGallery(data.hits); // data.hits — це масив картинок
      totalShow += data.hits.length;

      if (totalShow >= data.totalHits) {
        hideLoadMoreButton();
      } else {
        showLoadMoreButton();
      }
    })

    .catch(error => {
      iziToast.error({
        title: 'Error',
        message: `Something went wrong: ${error.message}`,
        position: 'topRight',
      });
    })
    .finally(() => {
      hideLoader(); // Приховати лоадер у будь-якому випадку
    });
}

async function handleClick() {
  page += 1;
  try {
    const dataGallery = await getImagesByQuery(query, page);
    console.log(dataGallery);

    createGallery(dataGallery.hits);

    const firstCard = document.querySelector('.gallery-item');

    if (firstCard) {
      const { height: cardHeight } = firstCard.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    totalShow += dataGallery.hits.length;

    if (totalShow >= dataGallery.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  }
}