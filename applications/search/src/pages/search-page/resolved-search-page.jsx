import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDatasets } from '../../api/get-datasets';
import { SearchPage } from './search-page';

const memoizedGetDataset = _.memoize(getDatasets);

const mapProps = {
  datasetItems: props => memoizedGetDataset(props.location.search)
};

export const ResolvedSearchPage = resolve(mapProps)(SearchPage);
