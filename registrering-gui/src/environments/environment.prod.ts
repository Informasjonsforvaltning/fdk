 declare var process:any;
export const environment = {
  production: true,
  envName: 'prod',
  api: window.document.getElementsByTagName('body')[0].getAttribute('data-reg-api-url')
};
