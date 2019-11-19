import { compose } from 'recompose';

import { catalogsPageConnector } from './catalogs-page-connector';
import { CatalogsPagePure } from './catalogs-page-pure';

const enhance = compose(catalogsPageConnector);
export const CatalogsPage = enhance(CatalogsPagePure);
