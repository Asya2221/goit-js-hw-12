import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');
const loader = document.querySelector('.loader');
const btnLoadMore = document.querySelector('.js-load-more');

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <li class="gallery-item">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" title="${tags}"/>
        <div class="info">
<p><b>💖 likes </b>${likes} </p>
<p><b>👁️ views </b> ${views}</p>
<p><b>💬 comments </b>${comments} </p>
<p><b>⬇️ downloads </b>${downloads} </p>
        </div>
        </a>
        </li>`;
      }
    )
    .join('');
  console.log(markup);
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.classList.add('is-visible');
}

export function hideLoader() {
  loader.classList.remove('is-visible');
}

export function showLoadMoreButton() {
  btnLoadMore.classList.add('load-more-hiden');
}

export function hideLoadMoreButton() {
  btnLoadMore.classList.remove('load-more-hiden');
}