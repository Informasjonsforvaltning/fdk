import {
  registrationApiDelete,
  registrationApiPatch,
  registrationApiPost,
  registrationApiPut
} from './registration-api';

export const catalogPath = catalogId => `/catalogs/${catalogId}`;
export const datasetListPath = catalogId =>
  `${catalogPath(catalogId)}/datasets/`; // todo, post method is implemented on / currently.

export const datasetPath = (catalogId, datasetId) =>
  `${datasetListPath(catalogId)}${datasetId}`;

export const deleteDataset = (catalogId, datasetId) =>
  registrationApiDelete(datasetPath(catalogId, datasetId));

export const patchDataset = (catalogId, datasetId, patch) =>
  registrationApiPatch(datasetPath(catalogId, datasetId), patch);

export const createDataset = catalogId =>
  registrationApiPost(datasetListPath(catalogId), {});

export const saveCatalog = catalog =>
  registrationApiPut(catalogPath(catalog.id), catalog);
