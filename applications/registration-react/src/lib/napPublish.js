import get from 'lodash/get';
import find from "lodash/find";
import {isNapTheme} from "../redux/modules/referenceData";

export const isNapPublish = (losItems, datasetItem) =>
  get(datasetItem, ['accessRights', 'uri']) === 'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
    && isNapTheme(losItems, datasetItem.theme)

export const isNapUnPublishAccessRights = (losItems, datasetItem) =>
  get(datasetItem, ['accessRights', 'uri']) !==
  'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
  && isNapTheme(losItems, datasetItem.theme)

export const isNapUnPublishTheme = (losItems, datasetItem) =>
  get(datasetItem, ['accessRights', 'uri']) ===
  'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
  && !isNapTheme(losItems, datasetItem.theme)
