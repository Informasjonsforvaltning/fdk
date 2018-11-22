import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import localization from '../../../utils/localization';
import './list-item.scss';

export const ListItem = props => {
  const { title, status, path, statusNew } = props;

  if (!(title || status)) {
    return null;
  }

  const itemClass = cx('w-75', 'fdk-text-size-small', {
    'fdk-color2': !title
  });

  return (
    <div className="fdk-list-item d-flex">
      <Link className="w-100" to={path}>
        <div className="d-flex justify-content-between">
          <span className={itemClass}>
            {title || localization.listItems.missingTitle}
          </span>
          <div className="d-flex w-25 justify-content-between">
            {status === 'PUBLISH' && (
              <span>
                <i className="fa fa-circle fdk-color-cta mr-2 d-none d-sm-inline" />
                <span>{localization.listItems.statusPublished}</span>
              </span>
            )}
            {status === 'DRAFT' && (
              <span>
                <i className="fa fa-circle fdk-color3 mr-2 d-none d-sm-inline" />
                <span>{localization.listItems.statusDraft}</span>
              </span>
            )}
            {statusNew && (
              <span className="badge badge-pill badge-success">
                {localization.listItems.statusNew}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

ListItem.defaultProps = {
  title: null,
  status: null,
  path: null,
  statusNew: false
};

ListItem.propTypes = {
  title: PropTypes.string,
  status: PropTypes.string,
  path: PropTypes.string,
  statusNew: PropTypes.bool
};
