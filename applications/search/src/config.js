import axios from 'axios';
import { isNapHostname } from './lib/nap-hostname';

const createConfig = env => ({
  store: { useLogger: env.REDUX_LOG === 'true' },
  disqusShortname: env.DISQUS_SHORTNAME,
  filterTransportDatasets:
    isNapHostname(window.location.hostname) ||
    !!localStorage.getItem('filterTransportDatasets'),
  themeNap:
    isNapHostname(window.location.hostname) ||
    !!localStorage.getItem('themeNap')
});
const config = createConfig({});

export const getConfig = () => config;

export const loadConfig = async () => {
  const response = await axios.get('/env.json');
  const env = response.data;
  Object.assign(config, createConfig(env));
};
