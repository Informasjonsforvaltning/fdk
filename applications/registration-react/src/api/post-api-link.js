import { post } from 'axios';

export const postApiLink = (catalogId, importUrl) => {
  const url = `/catalogs/${catalogId}/apis`;

  return post(url, { apiSpecUrl: importUrl }).then(response => response.data);
};
