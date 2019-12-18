import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import localization from '../../../services/localization';
import { ListItemsPure } from '../../../components/list-items/list-items.component';
import './dataset-items-list.scss';

export const DatasetItemsList = ({
  isReadOnly,
  catalogId,
  datasetItems,
  onClickCreateDataset
}) => {
  const [sortField, setSortField] = useState('');
  const [sortType, setSortType] = useState('');

  const onSortField = (field, type) => {
    setSortField(field);
    setSortType(type);
  };

  return (
    <div>
      {!isReadOnly && (
        <div className="d-flex mb-3">
          <button
            type="button"
            className="fdk-button fdk-button-cta"
            onClick={() => onClickCreateDataset(catalogId)}
          >
            <i className="fa fa-plus fdk-color-white mr-2" />
            {localization.datasets.list.btnNewDataset}
          </button>
        </div>
      )}

      <ListItemsPure
        catalogId={catalogId}
        items={datasetItems}
        sortField={sortField}
        sortType={sortType}
        onSortField={onSortField}
        prefixPath={`/catalogs/${catalogId}/datasets`}
      />
    </div>
  );
};

DatasetItemsList.defaultProps = {
  datasetItems: null,
  onClickCreateDataset: _.noop
};

DatasetItemsList.propTypes = {
  catalogId: PropTypes.string.isRequired,
  datasetItems: PropTypes.array,
  onClickCreateDataset: PropTypes.func
};
