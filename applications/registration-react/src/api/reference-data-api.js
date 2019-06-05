import url from 'url';

const referenceDataApiConfig = {};

export const configureReferenceDataApi = newReferenceDataApiConfig =>
  Object.assign(referenceDataApiConfig, newReferenceDataApiConfig);

const fetchOptions = () => {
  const {
    headers: { authorization }
  } = referenceDataApiConfig;
  const options = {};
  if (authorization) {
    Object.assign(options, { headers: { authorization } });
  }
  return options;
};

const rootUrl = () =>
  url.resolve(referenceDataApiConfig.host, '/reference-data/');

const resolvePath = path => url.resolve(rootUrl(), path);

const get = path =>
  fetch(resolvePath(path), fetchOptions()).then(response => response.json());

export const referenceDataApi = {
  get
};
