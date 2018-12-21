import _ from 'lodash';
import axios from 'axios';
import qs from 'qs';

import { addOrReplaceParam } from '../lib/addOrReplaceUrlParam';
import { normalizeAggregations } from '../lib/normalizeAggregations';

export const getConcepts = async search => {
  let conceptsUrl = `/api/concepts${search}`;
  const parsedParameters = qs.parse(search.split('?')[1]);

  if (_.get(parsedParameters, 'from')) {
    const { from } = parsedParameters;
    const page = Math.ceil(from / 10);
    conceptsUrl = addOrReplaceParam(conceptsUrl, 'from', '');
    conceptsUrl = addOrReplaceParam(conceptsUrl, 'page', page);
  }

  conceptsUrl = addOrReplaceParam(conceptsUrl, 'size', '10');
  conceptsUrl = addOrReplaceParam(conceptsUrl, 'aggregations', 'true');

  const response = await axios
    .get(conceptsUrl)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && normalizeAggregations(response.data);
};

export const createNestedListOfConceptPublishers = listOfPublishers => {
  if (!listOfPublishers) {
    return null;
  }

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
};
export const extractPublisherConceptsCounts = conceptsSearchResponse =>
  createNestedListOfConceptPublishers(
    _.get(conceptsSearchResponse, ['aggregations', 'orgPath', 'buckets'])
  );
