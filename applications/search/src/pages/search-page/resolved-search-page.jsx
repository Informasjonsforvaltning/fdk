import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDatasets } from '../../api/get-datasets';
import { SearchPage } from './search-page';
import { getTerms } from '../../api/get-terms';
import { fakeApiItem } from '../api-details-page/fixtures/fake-api-item';

const memoizedGetDataset = _.memoize(getDatasets);
const memoizedGetTerms = _.memoize(getTerms);

const mapProps = {
  datasetItems: props => memoizedGetDataset(props.location.search),
  termItems: props => memoizedGetTerms(props.location.search),
  apiItems: () => ({
    aggregations: {},
    hits: { hits: [{ _source: fakeApiItem }] }
  })
};

export const ResolvedSearchPage = resolve(mapProps)(SearchPage);
