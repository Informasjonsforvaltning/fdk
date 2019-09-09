import axios from 'axios';
import { isNapHostname } from './lib/nap-hostname';

const createConfig = env => {
  const searchApi = {
    host: env.SEARCH_API_HOST || '',
    // in ut1 and st1, search api requires basic authentication
    authorization: env.SEARCH_API_AUTHORIZATION || undefined
  };
  const defaultToSearchApi = host => (host ? { host } : searchApi);

  return {
    store: { useLogger: env.REDUX_LOG === 'true' },
    disqusShortname: env.DISQUS_SHORTNAME,
    filterTransportDatasets:
      isNapHostname(window.location.hostname) ||
      !!localStorage.getItem('filterTransportDatasets'),
    themeNap:
      isNapHostname(window.location.hostname) ||
      !!localStorage.getItem('themeNap'),
    apiApi:  defaultToSearchApi(env.API_API_HOST)
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
  // });

  // override all env variables to local docker
  // Object.assign(env, {
  //   SEARCH_API_HOST: 'http://localhost:8080',
  // });

  Object.assign(config, createConfig(env));
};
