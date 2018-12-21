import _ from 'lodash';
import { resolve } from 'react-resolver';
import { SearchPageWithState } from './search-page';
import { getConcepts } from '../../api/get-concepts';

const memoizedGetConcepts = _.memoize(getConcepts);

const mapProps = {
  conceptItems: props => memoizedGetConcepts(props.location.search)
};

export const ResolvedSearchPage = resolve(mapProps)(SearchPageWithState);
