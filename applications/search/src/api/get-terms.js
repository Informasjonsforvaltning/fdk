import _ from 'lodash';
import axios from 'axios';

import { addOrReplaceParam } from '../lib/addOrReplaceUrlParam';

export const getTerms = async search => {
  const datasetsUrl = `/terms${search}`;
  const url = addOrReplaceParam(datasetsUrl, 'size', '50');

  const response = await axios
    .get(url)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && response.data;
};

function createNestedListOfPublishers(listOfPublishers) {
  const flat = _(listOfPublishers).forEach(f => {
    const filteredOrgs = _(listOfPublishers)
      .filter(g => g.key.substring(0, g.key.lastIndexOf('/')) === f.key)
      .value();
    filteredOrgs.forEach(item => {
      const retVal = item;
      retVal.hasParent = true;
      return retVal;
    });
    const retVal = f;
    retVal.children = filteredOrgs;
    return retVal;
  });

  return _(flat)
    .filter(f => !f.hasParent)
    .value();
}
export const extractPublisherTermsCounts = termsSearchResponse =>
  createNestedListOfPublishers(
    termsSearchResponse.aggregations.orgPath.buckets
  );
