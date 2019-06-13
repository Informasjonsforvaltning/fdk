import {
  registrationApiDelete,
  registrationApiPatch
} from './registration-api';

export const catalogPath = catalogId => `/catalogs/${catalogId}`;
export const apiListPath = catalogId => `${catalogPath(catalogId)}/apis`;

export const apiPath = (catalogId, apidId) =>
  `${apiListPath(catalogId)}/${apidId}`;

export const deleteApi = (catalogId, apidId) =>
  registrationApiDelete(apiPath(catalogId, apidId));

export const patchApi = (catalogId, apidId, patch) =>
  registrationApiPatch(apiPath(catalogId, apidId), patch);
