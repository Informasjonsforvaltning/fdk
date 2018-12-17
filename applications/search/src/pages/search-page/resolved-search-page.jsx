import _ from 'lodash';
import { resolve } from 'react-resolver';
import { SearchPage } from './search-page';
import { getConcepts } from '../../api/get-concepts';
import { getApis } from '../../api/get-apis';

const memoizedGetConcepts = _.memoize(getConcepts);
//const memoizedGetApis = _.memoize(getApis);

const mapProps = {
  conceptItems: props => memoizedGetConcepts(props.location.search),
  //apiItems: props => memoizedGetApis(props.location.search)
};

export const ResolvedSearchPage = resolve(mapProps)(SearchPage);
