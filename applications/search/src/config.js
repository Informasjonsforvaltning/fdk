import _ from 'lodash';
import axios from 'axios';

// The initial values are to be overwritten with config from server. See /search/server/client-config.js
// The purpose of this declaration is to enable IntelliJ code completion. Fix with typescript
export const config = {
  reduxLog: false,
  disqusShortname: undefined,
  keycloak: {
    realm: 'demo',
    url: 'http://localhost:8084/auth',
    clientId: 'fdk-public'
  }
};

export const loadConfig = async () => {
  const response = await axios.get('/client-config.json');
  const serverConfig = _.pick(response.data, Object.keys(config));
  Object.assign(config, serverConfig);
};
