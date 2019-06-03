import url from 'url';

export const configureReferenceDataApi = referenceDataApiConfig => {
  const { host, headers = {} } = referenceDataApiConfig;
  const { authorization } = headers;
  const rootUrl = url.resolve(host, '/reference-data/');

  const options = {};
  if (authorization) {
    Object.assign(options, { headers: { authorization } });
  }

  const resolvePath = path => url.resolve(rootUrl, path);

  return {
    get: path =>
      fetch(resolvePath(path), options).then(response => response.json())
  };
};
