import { fetchImages } from './js/pixabay-api.js';
import { renderImg, smoothScroll } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-input'),
  loader: document.querySelector('.loader'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-btn'),
};

const params = {
  query: '',
  page: 1,
  totalHits: 0,
};

function showLoader() {
  refs.loader.classList.remove('hidden');
}

function hideLoader() {
  refs.loader.classList.add('hidden');
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('hidden');
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('hidden');
}

refs.form.addEventListener('submit', async event => {
  event.preventDefault();
  params.query = refs.input.value.trim();
  params.page = 1;

  if (!params.query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term!',
      position: 'topRight',
      timeout: 2000,
    });
    refs.input.value = '';
    renderImg([], true);
    return;
  }

  showLoader();
  hideLoadMoreBtn();

  try {
    const { hits, totalHits: newTotalHits } = await fetchImages(
      params.query,
      params.page
    );
    params.totalHits = newTotalHits;

    renderImg([], true);

    if (hits.length === 0) {
      iziToast.info({
        title: 'Oops!',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        timeout: 3000,
      });
    } else {
      renderImg(hits, true);
      if (hits.length < params.totalHits) {
        showLoadMoreBtn();
      }
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong! Please try again later.',
      position: 'topRight',
      timeout: 3000,
    });
    renderImg([], true);
    console.error('Error fetching images:', error);
  } finally {
    hideLoader();
  }
});

refs.loadMoreBtn.addEventListener('click', async () => {
  params.page += 1;
  hideLoadMoreBtn();
  showLoader();

  try {
    const { hits } = await fetchImages(params.query, params.page);

    if (hits.length === 0) {
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 3000,
      });
      return;
    }

    renderImg(hits, false);
    smoothScroll();

    if (hits.length < 40) { 
      hideLoadMoreBtn();
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomRight',
        timeout: 3000,
      });
    } else {
      showLoadMoreBtn();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong! Please try again later.',
      position: 'topRight',
      timeout: 3000,
    });
    console.error('Error fetching images:', error);
  } finally {
    showLoader();
  }
});