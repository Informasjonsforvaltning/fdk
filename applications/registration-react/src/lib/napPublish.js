import get from 'lodash/get';
import find from "lodash/find";

export const isNapPublish = datasetItem =>
  get(datasetItem, ['accessRights', 'uri']) === 'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
    && find(datasetItem.theme, {'uri': 'http://psi.norge.no/los/tema/trafikk-reiser-og-samferdsel'})

export const isNapUnPublishAccessRights = datasetItem =>
  get(datasetItem, ['accessRights', 'uri']) !==
  'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
  && find(datasetItem.theme, {'uri': 'http://psi.norge.no/los/tema/trafikk-reiser-og-samferdsel'})

export const isNapUnPublishTheme = datasetItem =>
  get(datasetItem, ['accessRights', 'uri']) ===
  'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
  && !find(datasetItem.theme, {'uri': 'http://psi.norge.no/los/tema/trafikk-reiser-og-samferdsel'})
