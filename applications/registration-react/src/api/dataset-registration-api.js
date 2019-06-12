import { deleteMethod, patchMethod } from './registration-api';

const datasetPath = (catalogId, datasetId) =>
  `catalogs/${catalogId}/datasets/${datasetId}`;

export const deleteDataset = (catalogId, datasetId) =>
  deleteMethod(datasetPath(catalogId, datasetId));

export const patchDataset = (catalogId, datasetId, patch) =>
  patchMethod(datasetPath(catalogId, datasetId), patch);
