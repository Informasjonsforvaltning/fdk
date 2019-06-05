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
      host: '/'
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
