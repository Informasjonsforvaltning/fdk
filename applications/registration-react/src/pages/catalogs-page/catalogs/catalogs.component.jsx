import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getConfig } from '../../../config';
import { CatalogItem } from './catalog-item/catalog-item.component';

export const Catalog = props => {
  const { catalogId, type, fetchItems, itemsCount } = props;
  fetchItems(catalogId);

  const linkUri =
    type === 'concepts'
      ? `${getConfig().conceptRegistration.host}/${catalogId}`
      : `/catalogs/${catalogId}/${type}`;

  return (
    <CatalogItem
      linkUri={linkUri}
      key={catalogId}
      publisherId={catalogId}
      type={type}
      itemsCount={itemsCount}
    />
  );
};

Catalog.defaultProps = {
  catalogId: null,
  fetchItems: _.noop,
  itemsCount: null
};

Catalog.propTypes = {
  catalogId: PropTypes.string,
  type: PropTypes.string.isRequired,
  fetchItems: PropTypes.func,
  itemsCount: PropTypes.number
};
