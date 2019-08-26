import includes from 'lodash.includes';

const napHostnamesWhitelist = {
  hostnames: ['nap.no']
};

export function isNapHostname(hostname) {
  return includes(napHostnamesWhitelist.hostnames, hostname);
}
