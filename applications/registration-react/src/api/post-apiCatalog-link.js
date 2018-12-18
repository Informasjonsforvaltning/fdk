import { post } from 'axios';

export const postApiCatalogLink = (catalogId, importUrl) => {
  const url = `/apicatalogs/save`;

  return post(url, { orgNo: catalogId, harvestSourceUri: importUrl }).then(
    response => response.data
  );
};
