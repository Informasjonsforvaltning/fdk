import { post } from 'axios';

export const postApiCatalogLink = (catalogId, importUrl) => {
  const url = `/catalogs/${catalogId}/apicatalog`;

  return post(url, { harvestSourceUri: importUrl }).then(
    response => response.data
  );
};
