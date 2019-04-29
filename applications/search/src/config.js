// Environment is configured in server and sent over to the client over jsonp.
// See here: search/server/views/index.ejs

const serverEnv = window.__SERVER_ENV__ || {};

export const config = {
  reduxLog: serverEnv.REDUX_LOG === 'true',
  disqusShortname: serverEnv.DISQUS_SHORTNAME
};
