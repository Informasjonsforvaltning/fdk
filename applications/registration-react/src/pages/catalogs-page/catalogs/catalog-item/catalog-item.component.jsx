import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import localization from '../../../../lib/localization';
import './catalog-item.component.scss';

export const CatalogItem = props => {
  const { type, itemsCount, linkUri } = props;

  const iconClass = cx('catalog-icon', {
    'catalog-icon--dataset': type === 'datasets',
    'catalog-icon--api': type === 'apis',
    'catalog-icon--concepts': type === 'concepts'
  });

  const itemClass = cx(
    'catalog-item__body',
    'd-flex',
    'flex-column',
    'align-items-center',
    {
      beta: type === 'concepts',
      'h-100': !itemsCount
    }
  );

  if (type === 'concepts') {
    return (
      <div className="col-md-4 pl-0">
        <a className="catalog-item" href={linkUri}>
          <div className={itemClass}>
            <h3 className={iconClass}>{localization.catalogs[type]}</h3>
            <span className="fdk-text-size-small fdk-color-neutral-dark">
              {itemsCount || 0} {localization.catalogs.type[type]}
            </span>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="col-md-4 pl-0">
      <Link className="catalog-item" to={linkUri}>
        <div className={itemClass}>
          <h3 className={iconClass}>{localization.catalogs[type]}</h3>
          <span className="fdk-text-size-small fdk-color-neutral-dark">
            {itemsCount || 0} {localization.catalogs.type[type]}
          </span>
        </div>
      </Link>
    </div>
  );
};

CatalogItem.defaultProps = {
  itemsCount: null
};

CatalogItem.propTypes = {
  type: PropTypes.string.isRequired,
  itemsCount: PropTypes.number,
  linkUri: PropTypes.string.isRequired
};
