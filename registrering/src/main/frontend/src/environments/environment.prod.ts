 declare var process:any;
var regApiUrl = window.document.getElementsByTagName('body')[0].getAttribute('data-reg-api-url');
var queryUrl = window.document.getElementsByTagName('body')[0].getAttribute('data-query-service-url');
export const environment = {
  production: true,
  envName: 'prod',
  api: regApiUrl.indexOf('<') === 0 ? 'https://localhost:8099' : regApiUrl,
  queryUrl: queryUrl.indexOf('<') === 0 ? 'https://localhost:8083' : queryUrl
};
