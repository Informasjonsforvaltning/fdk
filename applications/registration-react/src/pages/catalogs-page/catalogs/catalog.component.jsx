import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash/memoize';

import { resolve } from 'react-resolver';
import { getConfig } from '../../../config';
import { CatalogItem } from './catalog-item/catalog-item.component';
import { getConceptCount } from '../../../api/concept-registration-api/host';

export const CatalogPure = props => {
  const { catalogId, type, fetchItems, itemsCount } = props;
  fetchItems(catalogId);

  const linkUri =
    type === 'concepts'
      ? `${getConfig().conceptRegistrationHost}/${catalogId}`
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

CatalogPure.defaultProps = {
  catalogId: null,
  fetchItems: () => {},
  itemsCount: null
};

CatalogPure.propTypes = {
  catalogId: PropTypes.string,
  type: PropTypes.string.isRequired,
  fetchItems: PropTypes.func,
  itemsCount: PropTypes.number
};

const memoizedGetConceptCount = memoize(getConceptCount);

const mapProps = {
  itemsCount: props =>
    props.type === 'concepts'
      ? memoizedGetConceptCount(props.catalogId) // placeholder for api request promise
      : props.itemsCount
};

export const Catalog = resolve(mapProps)(CatalogPure);
