import includes from 'lodash/includes';

const napHostnamesWhitelist = {
  hostnames: [
    'nap.ut1.fellesdatakatalog.brreg.no',
    'nap.st1.fellesdatakatalog.brreg.no',
    'nap.it1.fellesdatakatalog.brreg.no',
    'nap.fellesdatakatalog.brreg.no'
  ]
};

export function isNapHostname(hostname) {
  return includes(napHostnamesWhitelist.hostnames, hostname);
}
