import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { CatalogItem } from './catalog-item/catalog-item.component';

export const Catalog = props => {
  const { catalogId, type, items, fetchItems } = props;
  fetchItems(catalogId);
  return (
    <CatalogItem
      key={catalogId}
      publisherId={catalogId}
      type={type}
      itemsCount={_.get(items, [catalogId, 'items'], []).length}
    />
  );
};

Catalog.defaultProps = {
  catalogId: null,
  items: false,
  fetchItems: _.noop
};

Catalog.propTypes = {
  catalogId: PropTypes.string,
  type: PropTypes.string.isRequired,
  items: PropTypes.object,
  fetchItems: PropTypes.func
};
