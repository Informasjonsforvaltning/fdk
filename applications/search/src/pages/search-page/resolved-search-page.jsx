import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDatasets } from '../../api/get-datasets';
import { SearchPage } from './search-page';
import { getTerms } from '../../api/get-terms';

const memoizedGetDataset = _.memoize(getDatasets);
const memoizedGetTerms = _.memoize(getTerms);

const mapProps = {
  datasetItems: props => memoizedGetDataset(props.location.search),
  termItems: props => memoizedGetTerms(props.location.search)
};

export const ResolvedSearchPage = resolve(mapProps)(SearchPage);
