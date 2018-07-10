import _defaultsDeep from 'lodash/defaultsDeep';
import apiItemFixture from './enhetsregisteretOpneData-openApi3.json';

export const fakeApiItem = _defaultsDeep(apiItemFixture, {
  id: 'id1',
  publisher: { name: 'Brønnøysundregistrene' },
  harvest: {
    firstHarvested: '2018-06-25T19:51:05+0200',
    lastHarvested: '2018-07-09T14:40:37+0200',
    lastChanged: '2018-07-09T14:40:37+0200',
    changed: [
      '2018-06-25T19:51:05+0200',
      '2018-06-25T19:51:12+0200',
      '2018-06-26T09:16:46+0200',
      '2018-06-28T09:22:41+0200',
      '2018-06-28T09:52:24+0200',
      '2018-06-29T15:25:53+0200',
      '2018-07-03T10:59:38+0200',
      '2018-07-09T14:40:37+0200'
    ]
  },
  info: {
    format: 'json',
    type: 'REST API',
    accessRights: {
      uri:
        'http://publications.europa.eu/resource/authority/access-right/PUBLIC',
      code: 'PUBLIC',
      prefLabel: {
        en: 'Public',
        nb: 'Offentlig',
        nn: 'Offentlig'
      }
    }
  }
});
