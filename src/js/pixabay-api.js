import axios from 'axios';

export async function getImagesByQuery(query, page = 1) {
  const { data } = await axios.get('https://pixabay.com/api/', {
    params: {
      page,
      per_page: 15,
      key: '50835299-cfd675820214f48c95352b76b',
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
  return data;
}