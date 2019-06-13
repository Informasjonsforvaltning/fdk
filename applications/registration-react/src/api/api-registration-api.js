import {
  registrationApiDelete,
  registrationApiGet,
  registrationApiPatch,
  registrationApiPost
} from './registration-api';

export const catalogPath = catalogId => `/catalogs/${catalogId}`;
export const apiCatalogPath = catalogId =>
  `${catalogPath(catalogId)}/apicatalog`;
export const apiListPath = catalogId => `${catalogPath(catalogId)}/apis`;

export const apiPath = (catalogId, apidId) =>
  `${apiListPath(catalogId)}/${apidId}`;

export const deleteApi = (catalogId, apidId) =>
  registrationApiDelete(apiPath(catalogId, apidId));

export const patchApi = (catalogId, apidId, patch) =>
  registrationApiPatch(apiPath(catalogId, apidId), patch);

export const getApiCatalog = catalogId =>
  registrationApiGet(apiCatalogPath(catalogId));

export const postApiCatalog = (catalogId, data) =>
  registrationApiPost(apiCatalogPath(catalogId), data);
