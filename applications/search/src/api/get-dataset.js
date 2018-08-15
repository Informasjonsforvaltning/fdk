import _ from 'lodash';
import axios from 'axios';

export const getDataset = async id => {
  const url = `/datasets/${id}`;

  const response = await axios.get(url);

  return _.get(response, 'data.hits.hits[0]._source');
};
