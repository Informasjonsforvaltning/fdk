import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash/memoize';

import { resolve } from 'react-resolver';
import { getConfig } from '../../../config';
import { CatalogItem } from './catalog-item/catalog-item.component';
import { getConceptCount } from '../../../services/api/concept-registration-api/host';

export const CatalogPure = props => {
  const { catalogId, type, fetchItems, itemsCount, isReadOnly } = props;
  fetchItems(catalogId);

  const getLinkUri = () => {
    switch (type) {
      case 'concepts': {
        return `${getConfig().conceptRegistrationHost}/${catalogId}`;
      }
      case 'protocol': {
        return `${getConfig().recordsOfProcessingActivitiesHost}/${catalogId}`;
      }
      default:
        return `/catalogs/${catalogId}/${type}`;
    }
  };

  const linkUri = getLinkUri();

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
  itemsCount: ({ type, catalogId, itemsCount }) => {
    switch (type) {
      case 'concepts': {
        return memoizedGetConceptCount(catalogId); // placeholder for api request promise
      }
      case 'protocol': {
        return memoizedGetConceptCount('123'); // placeholder for api request promise
      }
      default:
        return itemsCount;
    }
  }
};

export const Catalog = resolve(mapProps)(CatalogPure);
