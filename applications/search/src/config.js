import axios from 'axios';

const createConfig = env => ({
  store: { useLogger: env.REDUX_LOG === 'true' },
  disqusShortname: env.DISQUS_SHORTNAME
});
const config = createConfig({});

export const getConfig = () => config;

export const loadConfig = async () => {
  const response = await axios.get('/env.json');
  const env = response.data;
  Object.assign(config, createConfig(env));
};
