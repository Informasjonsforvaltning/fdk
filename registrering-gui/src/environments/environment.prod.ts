declare var process:any;
var regApiUrl = window.document.getElementsByTagName('body')[0].getAttribute('data-reg-api-url');
var queryUrl = window.document.getElementsByTagName('body')[0].getAttribute('data-query-service-url');
var themesAndCodesUrl = window.document.getElementsByTagName('body')[0].getAttribute('data-themes-and-codes-url');
export const environment = {
  production: true,
  envName: 'prod',
  api: regApiUrl.indexOf('<') === 0 ? 'http://localhost:8099' : regApiUrl,
  queryUrl: queryUrl.indexOf('<') === 0 ? 'http://localhost:8100' : queryUrl
};
