import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getAPICatalogsByOrgNr } from '../../api/get-apiCatalogs';
import { EnhancedAPIListPage } from './api-list-page';

const memoizedGetAPICatalogsByOrgNr = _.memoize(getAPICatalogsByOrgNr);

const mapProps = {
  apiCatalogs: props =>
    memoizedGetAPICatalogsByOrgNr(_.get(props.match, ['params', 'catalogId']))
};

export const ResolvedAPIListPage = resolve(mapProps)(EnhancedAPIListPage);
