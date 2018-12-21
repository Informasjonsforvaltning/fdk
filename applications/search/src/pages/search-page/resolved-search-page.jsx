import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDatasets } from '../../api/get-datasets';
import { SearchPageWithState } from './search-page';
import { getConcepts } from '../../api/get-concepts';
import { getApis } from '../../api/get-apis';

const memoizedGetDataset = _.memoize(getDatasets);
const memoizedGetConcepts = _.memoize(getConcepts);
const memoizedGetApis = _.memoize(getApis);

const mapProps = {
  datasetItems: props => memoizedGetDataset(props.location.search),
  conceptItems: props => memoizedGetConcepts(props.location.search),
  apiItems: props => memoizedGetApis(props.location.search)
};

export const ResolvedSearchPage = resolve(mapProps)(SearchPageWithState);
