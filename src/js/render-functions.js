import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function renderImg(images, clear = false) {
  const gallery = document.querySelector('.gallery');
  if (clear) {
    gallery.innerHTML = '';
  }
  const markup = images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <a href="${largeImageURL}" class="gallery-item">
        <img src="${webformatURL}" alt="${tags}" />
        <div class="image-info">
          <p class="image-title"><strong>Likes:</strong> ${likes}</p>
          <p class="image-title"><strong>Views:</strong> ${views}</p>
          <p class="image-title"><strong>Comments:</strong> ${comments}</p>
          <p class="image-title"><strong>Downloads:</strong> ${downloads}</p>
        </div>
      </a>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
    overlayOpacity: 1,
    showCounter: false,
  });

  lightbox.refresh();
}

export function smoothScroll() {
  const cardHeight =
    document.querySelector('.gallery-item')?.getBoundingClientRect().height ||
    100;
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}
