import _ from 'lodash';
import { resolve } from 'react-resolver';
import { ApiDetailsPage } from './api-details-page';
import { getApi } from '../../api/get-api';

const memoizedGetApi = _.memoize(getApi);

const mapProps = {
  apiItem: props => memoizedGetApi(props.match.params.id)
};

export const ResolvedApiDetailsPage = resolve(mapProps)(ApiDetailsPage);
