import { deleteMethod } from './registration-api';

const datasetPath = (catalogId, datasetId) =>
  `catalogs/${catalogId}/datasets/${datasetId}`;

export const deleteDataset = (catalogId, datasetId) =>
  deleteMethod(datasetPath(catalogId, datasetId));
