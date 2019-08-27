import axios from 'axios';

const createConfig = env => {
  const searchHost = env.SEARCH_HOST || 'https://fellesdatakatalog.brreg.no';
  const searchApi = {
    host: env.SEARCH_API_HOST || searchHost,
    // in ut1 and st1, search api requires basic authentication
    authorization: env.SEARCH_API_AUTHORIZATION || undefined
  };
  const defaultToSearchApi = host => (host ? { host } : searchApi);

  return {
    store: { useLogger: env.REDUX_LOG === 'true' },
    registrationLanguage: env.REGISTRATION_LANGUAGE || 'nb',
    searchHost,
    referenceDataApi: defaultToSearchApi(env.REFERENCE_DATA_HOST),
    apiApi: defaultToSearchApi(env.API_API_HOST),
    datasetApi: defaultToSearchApi(env.DATASET_API_HOST),
    conceptApi: defaultToSearchApi(env.CONCEPT_API_HOST),
    publisherApi: defaultToSearchApi(env.PUBLISHER_API_HOST),
    // default configuration runs in cluster through proxy, assuming frontend comes from the same origin
    registrationApi: { host: env.REGISTRATION_API_HOST || '' },
    keycloak: {
      realm: 'fdk',
      url: `${env.SSO_HOST}/auth`,
      clientId: 'fdk-registration-public'
    },
    conceptRegistration: {
      host: env.CONCEPT_REGISTRATION_HOST || undefined,
      api: env.CONCEPT_REGISTRATION_API_HOST || undefined
    }
  };
};

const config = createConfig({});

export const getConfig = () => config;

export const loadConfig = async () => {
  const response = await axios.get('/env.json');
  const env = response.data;
  Object.assign(config, createConfig(env));
};
