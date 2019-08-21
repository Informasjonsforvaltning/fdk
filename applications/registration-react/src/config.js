import axios from 'axios';

const createConfig = env => {
  const searchHost =
    env.SEARCH_HOST ||
    (env.SEARCH_HOSTNAME && `https://${env.SEARCH_HOSTNAME}`) ||
    'https://fellesdatakatalog.brreg.no';

  return {
    store: { useLogger: env.REDUX_LOG === 'true' },
    registrationLanguage: env.REGISTRATION_LANGUAGE || 'nb',
    searchHost,
    referenceDataApi: {
      host: env.REFERENCE_DATA_HOST || searchHost,
      headers: {
        authorization: env.REFERENCE_DATA_AUTHORIZATION || undefined
      }
    },
    registrationApi: {
      // in cluster through proxy, assuming frontend comes from the same origin
      host: '/'
      // to call api on host
      // host: 'http://localhost:8115/'
      // direct api in docker-compose cluster, bypassing ingress proxy
      // host: 'http://localhost:8114/'
    },
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
