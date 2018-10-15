import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import localization from '../../../../utils/localization';
import './catalog-item.component.scss';

export const CatalogItem = props => {
  const { publisherId, type, itemsCount } = props;
  const iconClass = cx('catalog-icon', {
    'catalog-icon--dataset': type === 'datasets',
    'catalog-icon--api': type === 'apis'
  });
  return (
    <div className="col-md-4 pl-0">
      <Link className="catalog-item" to={`/catalogs/${publisherId}/${type}`}>
        <div className="catalog-item__body d-flex flex-column align-items-center">
          <h3 className={iconClass}>{localization.catalogs[type]}</h3>
          {itemsCount && (
            <span className="fdk-text-size-small fdk-color-dark-2">
              {itemsCount} {localization.catalogs.type[type]}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

CatalogItem.defaultProps = {
  itemsCount: null
};

CatalogItem.propTypes = {
  publisherId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  itemsCount: PropTypes.number
};
