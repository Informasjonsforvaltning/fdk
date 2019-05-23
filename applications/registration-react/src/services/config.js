import axios from 'axios';

const createConfig = env => ({
  registrationLanguage: env.REGISTRATION_LANGUAGE || 'nb',
  searchHost:
    `https://${env.SEARCH_HOSTNAME}` || 'https://fellesdatakatalog.brreg.no'
});

export const getConfig = async () => {
  const response = await axios.get('/env.json');
  const env = response.data;
  return createConfig(env);
};
