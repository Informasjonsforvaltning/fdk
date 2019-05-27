import url from 'url';

export const configureRegistrationApi = registrationApiConfig => {
  const { host } = registrationApiConfig;
  const rootUrl = host;
  const resolveUrl = path => url.resolve(rootUrl, path);

  const datasetUrl = (catalogId, datasetId) =>
    resolveUrl(`catalogs/${catalogId}/datasets/${datasetId}`);

  const validateResponse = response => {
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }
    return response;
  };

  const deleteMethod = url =>
    fetch(url, {
      method: 'DELETE',
      headers: { Accept: 'application/json' } // required for cors
    }).then(validateResponse);

  const getMethod = url => fetch(url).then(validateResponse);

  const get = path =>
    getMethod(resolveUrl(path)).then(response => response.json());

  const deleteDataset = (catalogId, datasetId) =>
    deleteMethod(datasetUrl(catalogId, datasetId));

  return {
    get,
    deleteDataset
  };
};
