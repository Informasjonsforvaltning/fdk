import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import localization from '../../utils/localization';
import './index.scss';

const DatasetItemsListItem  = (props) => {
  const { item } = props;
  return (
    <div className="fdk-datasets-list-item d-flex">
      {item &&
        <Link className="w-100" to={`/catalogs/910244132/datasets/${item.id}`}>
          <div className="d-flex justify-content-between">
            <span className="w-75">{item.title.nb ? item.title.nb : localization.datasets.list.missingTitle}</span>
            <span className="d-flex w-25">
              {item.registrationStatus === 'PUBLISH' &&
              <span>
                <i className="fa fa-circle fdk-color-cta mr-2"/>
                <span>{localization.datasets.list.statusPublished}</span>
              </span>
              }
              {item.registrationStatus === 'DRAFT' &&
              <span>
                <i className="fa fa-circle fdk-color3 mr-2"/>
                <span>{localization.datasets.list.statusDraft}</span>
              </span>
              }
            </span>
          </div>
        </Link>
      }
    </div>
  );
}

DatasetItemsListItem.defaultProps = {
};

DatasetItemsListItem.propTypes = {
};

export default DatasetItemsListItem;
