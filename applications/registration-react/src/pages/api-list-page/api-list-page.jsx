import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import localization from '../../utils/localization';
import ListItems from '../../components/list-items/list-items.component';
import getTranslateText from '../../utils/translateText';

export const APIListPage = props => {
  const {
    catalogItem,
    items,
    fetchCatalogIfNeeded,
    fetchApisIfNeeded,
    match
  } = props;

  const catalogId = _.get(match, ['params', 'catalogId']);
  if (catalogId) {
    fetchCatalogIfNeeded(catalogId);
    fetchApisIfNeeded(catalogId);
  }

  return (
    <div className="container">
      <div className="row mb-5">
        <div className="col-12">
          <h1>{localization.api.register.apiCatalog}</h1>
          <div className="fdk-reg-datasets-publisher mt-2 mb-4">
            {getTranslateText(_.get(catalogItem, ['publisher', 'prefLabel'])) ||
              _.get(catalogItem, ['publisher', 'name'])}
          </div>
        </div>
      </div>
      <div className="row mb-5">
        <div className="col-12">
          <Link className="ml-0" to={`/catalogs/${catalogId}/apis/import`}>
            <i className="fa fa-plus mr-2" />
            {localization.api.register.registerNew}
          </Link>
        </div>
      </div>
      <div className="row mb-2 mb-md-5">
        {catalogItem && (
          <div className="col-12 fdk-reg-datasets-list">
            <ListItems
              catalogId={catalogId}
              items={items}
              itemTitleField={['openApi', 'info', 'title']}
              prefixPath={`/catalogs/${catalogId}/apis`}
              defaultEmptyListText={localization.listItems.missingApiItems}
            />
          </div>
        )}
      </div>
    </div>
  );
};

APIListPage.defaultProps = {
  catalogItem: null,
  items: null,
  fetchCatalogIfNeeded: () => {},
  fetchApisIfNeeded: () => {},
  match: null
};

APIListPage.propTypes = {
  catalogItem: PropTypes.object,
  items: PropTypes.array,
  fetchCatalogIfNeeded: PropTypes.func,
  fetchApisIfNeeded: PropTypes.func,
  match: PropTypes.object
};
