import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDatasetByURI } from '../../services/api/search-api/datasets';

const memoizedGetDatasetByURI = _.memoize(getDatasetByURI);

const mapProps = {
  referencedDatasets: props =>
    Promise.all(
      _.get(props.item, 'datasetUris', []).map(memoizedGetDatasetByURI)
    )
};

export const apiRegistrationResolver = resolve(mapProps);
