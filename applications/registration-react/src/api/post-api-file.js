import { post } from 'axios';

export const postApiFile = (catalogId, apiSpec) => {
  const url = `/catalogs/${catalogId}/apis`;

  return post(url, { apiSpec }).then(response => response.data);
};
