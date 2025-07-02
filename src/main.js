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

  query = input.value.trim().toLowerCase();
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

  clearGallery();
  hideLoadMoreButton(); // скрыть кнопку до загрузки
  showLoader();

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

      createGallery(data.hits);
      totalShow += data.hits.length;

      if (totalShow >= data.totalHits) {
        hideLoadMoreButton();
        iziToast.info({
          title: 'Info',
          message: `We're sorry, but you've reached the end of search results.`,
          position: 'topRight',
        });
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
      hideLoader();
    });
}

async function handleClick() {
  page += 1;
  hideLoadMoreButton(); // скрыть кнопку на время загрузки
  showLoader(); // показать лоадер

  try {
    const dataGallery = await getImagesByQuery(query, page);
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
    } else {
      showLoadMoreButton(); // показываем обратно
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader(); // скрыть лоадер
  }
}