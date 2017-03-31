 declare var process:any;
export const environment = {
  production: true,
  envName: 'prod',
  api: window.document.getElementsByTagName('body')[0].getAttribute('data-reg-api-url'),
  queryUrl: window.document.getElementsByTagName('body')[0].getAttribute('data-query-service-url')
};
