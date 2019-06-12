import { deleteMethod, patchMethod, postMethod } from './registration-api';

export const datasetListPath = catalogId => `/catalogs/${catalogId}/datasets/`; // todo, post method is implemented on / currently.

export const datasetPath = (catalogId, datasetId) =>
  `${datasetListPath(catalogId)}${datasetId}`;

export const deleteDataset = (catalogId, datasetId) =>
  deleteMethod(datasetPath(catalogId, datasetId));

export const patchDataset = (catalogId, datasetId, patch) =>
  patchMethod(datasetPath(catalogId, datasetId), patch);

export const createDataset = catalogId =>
  postMethod(datasetListPath(catalogId), {});
