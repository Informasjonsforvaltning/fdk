import axios from 'axios';
import { isNapProfile } from './lib/nap-profile';

const createConfig = env => {
  const searchApi = {
    host: env.SEARCH_API_HOST || '',
    // in ut1 and st1, search api requires basic authentication
    config: env.SEARCH_API_AUTHORIZATION
      ? { headers: { authorization: env.SEARCH_API_AUTHORIZATION } }
      : undefined
  };
  const defaultToSearchApi = host => (host ? { host } : searchApi);

  return {
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
};

const config = createConfig({});

export const getConfig = () => config;

export const loadConfig = async () => {
  const response = await axios.get('/env.json');
  const env = response.data;

  // The below method of configuration override is useful when using webpack devserver.

  // override all env variables to ut1
  // Object.assign(env, {
  //   SEARCH_API_HOST: 'https://www.ut1.fellesdatakatalog.brreg.no',
  //   SEARCH_API_AUTHORIZATION: 'Basic ZmRrOkJSUkVH',
  //   SEARCH_HOST: 'https://www.ut1.fellesdatakatalog.brreg.no',
  //   USE_DEMO_LOGO: true
  // });

  // override all env variables to local docker
  // Object.assign(env, {
  //   SEARCH_API_HOST: 'http://localhost:8080',
  //   USE_DEMO_LOGO: true
  // });

  Object.assign(config, createConfig(env));
};
