import { isNapProfile } from './lib/nap-profile';

const env = window.env || {
  SEARCH_API_HOST: 'http://localhost:8080',
  USE_DEMO_LOGO: true
};

// override all env variables to ut1 (inspired by https://www.ut1.fellesdatakatalog.brreg.no/config.js)
// env.SEARCH_API_HOST = 'https://www.ut1.fellesdatakatalog.brreg.no';
// env.SEARCH_API_AUTHORIZATION = 'Basic ZmRrOkJSUkVH';
// env.SEARCH_HOST = 'https://www.ut1.fellesdatakatalog.brreg.no';
// env.USE_DEMO_LOGO = true;

const searchApi = {
  host: env.SEARCH_API_HOST || '',
  // in ut1 and st1, search api requires basic authentication
  config: env.SEARCH_API_AUTHORIZATION
    ? { headers: { authorization: env.SEARCH_API_AUTHORIZATION } }
    : undefined
};

const defaultToSearchApi = host => (host ? { host } : searchApi);

const config = {
  store: { useLogger: env.REDUX_LOG === 'true' },
  filterTransportDatasets: isNapProfile(env.NAP_HOST),
  themeNap: isNapProfile(env.NAP_HOST),
  datasetApi: defaultToSearchApi(env.DATASET_API_HOST),
  apiApi: defaultToSearchApi(env.API_API_HOST),
  conceptApi: defaultToSearchApi(env.CONCEPT_API_HOST),
  informationmodelApi: defaultToSearchApi(env.INFORMATIONMODEL_API_HOST),
  publisherApi: defaultToSearchApi(env.PUBLISHER_API_HOST),
  catalogApi: defaultToSearchApi(env.CATALOG_API_HOST),
  referenceDataApi: defaultToSearchApi(env.REFERENCE_DATA_HOST),
  searchHost: defaultToSearchApi(env.SEARCH_HOST),
  useDemoLogo: env.USE_DEMO_LOGO
};

export const getConfig = () => config;
