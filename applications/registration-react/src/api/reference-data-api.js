import url from 'url';

export const configureReferenceDataApi = referenceDataApiConfig => {
  const { host } = referenceDataApiConfig;
  const rootUrl = url.resolve(host, '/reference-data/');
  const resolvePath = path => url.resolve(rootUrl, path);
  return {
    get: path => fetch(resolvePath(path)).then(response => response.json())
  };
};
