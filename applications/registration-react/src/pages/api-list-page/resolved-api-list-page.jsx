import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getAPICatalogsByOrgNr } from '../../api/get-apiCatalogs';
import { EnhancedAPIListPage } from './api-list-page';

const mapProps = {
  apiCatalogs: props =>
    getAPICatalogsByOrgNr(_.get(props.match, ['params', 'catalogId'])) // no memoize as it needs to update after new catalog harvest
};

export const ResolvedAPIListPage = resolve(mapProps)(EnhancedAPIListPage);
