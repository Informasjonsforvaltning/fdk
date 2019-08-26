import _ from 'lodash';
import { resolve } from 'react-resolver';
import { searchApis } from '../../../api/search-api/apis';

const memoizedSearchApis = _.memoize(searchApis, JSON.stringify);

const mapProps = {
  connectedApisByDatasetId: ({ datasetUri }) =>
    memoizedSearchApis({ datasetUri, returnFields: 'id,title,publisher' })
};

export const formDistributionApiResolver = resolve(mapProps);
