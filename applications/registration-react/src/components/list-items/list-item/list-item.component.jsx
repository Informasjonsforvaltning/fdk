import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import _ from 'lodash';

import localization from '../../../utils/localization';
import getTranslateText from '../../../utils/translateText';
import './list-item.scss';

export const ListItem = props => {
  const { catalogId, item } = props;

  if (!item) {
    return null;
  }

  const itemClass = cx('w-75', 'fdk-text-size-small', {
    'fdk-color2': item && !getTranslateText(_.get(item, 'title'))
  });

  return (
    <div className="fdk-datasets-list-item d-flex">
      <Link className="w-100" to={`/catalogs/${catalogId}/datasets/${item.id}`}>
        <div className="d-flex justify-content-between">
          <span className={itemClass}>
            {getTranslateText(_.get(item, 'title')) ||
              localization.datasets.list.missingTitle}
          </span>
          <span className="d-flex w-25">
            {_.get(item, 'registrationStatus') === 'PUBLISH' && (
              <span>
                <i className="fa fa-circle fdk-color-cta mr-2" />
                <span>{localization.datasets.list.statusPublished}</span>
              </span>
            )}
            {_.get(item, 'registrationStatus') === 'DRAFT' && (
              <span>
                <i className="fa fa-circle fdk-color3 mr-2" />
                <span>{localization.datasets.list.statusDraft}</span>
              </span>
            )}
          </span>
        </div>
      </Link>
    </div>
  );
};

ListItem.defaultProps = {
  item: null
};

ListItem.propTypes = {
  catalogId: PropTypes.string.isRequired,
  item: PropTypes.object
};
