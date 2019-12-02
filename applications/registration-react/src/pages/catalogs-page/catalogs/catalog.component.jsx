import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash/memoize';

import { resolve } from 'react-resolver';
import { getConfig } from '../../../services/config';
import { CatalogItem } from './catalog-item/catalog-item.component';
import { getConceptCount } from '../../../services/api/concept-registration-api/host';

export const CatalogPure = props => {
  const { catalogId, type, fetchItems, itemsCount, isReadOnly } = props;
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
      isReadOnly={isReadOnly}
    />
  );
};

CatalogPure.defaultProps = {
  catalogId: null,
  fetchItems: () => {},
  itemsCount: null,
  isReadOnly: false
};

CatalogPure.propTypes = {
  catalogId: PropTypes.string,
  type: PropTypes.string.isRequired,
  fetchItems: PropTypes.func,
  itemsCount: PropTypes.number,
  isReadOnly: PropTypes.bool
};

const memoizedGetConceptCount = memoize(getConceptCount);

const mapProps = {
  itemsCount: props =>
    props.type === 'concepts'
      ? memoizedGetConceptCount(props.catalogId) // placeholder for api request promise
      : props.itemsCount
};

export const Catalog = resolve(mapProps)(CatalogPure);
