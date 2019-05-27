import axios from 'axios';

const createConfig = env => {
  const searchHost =
    env.SEARCH_HOST ||
    `https://${env.SEARCH_HOSTNAME}` ||
    'https://fellesdatakatalog.brreg.no';

  return {
    store: { useLogger: env.REDUX_LOG === 'true' },
    registrationLanguage: env.REGISTRATION_LANGUAGE || 'nb',
    searchHost,
    referenceDataApi: {
      host: env.REFERENCE_DATA_HOST || searchHost
    },
    registrationApi: {
      host: '/'
    }
  };
};

export const getConfig = async () => {
  const response = await axios.get('/env.json');
  const env = response.data;
  return createConfig(env);
};
