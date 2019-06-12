import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import _ from 'lodash';

import localization from '../../../lib/localization';
import ImportModal from '../../../components/import-modal/import-modal.component';
import { ListItems } from '../../../components/list-items/list-items.component';
import './dataset-items-list.scss';

export const DatasetItemsList = ({
  catalogId,
  datasetItems,
  onClickCreateDataset
}) => {
  const [sortField, setSortField] = useState('');
  const [sortType, setSortType] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const toggleShowImportModal = () => setShowImportModal(!showImportModal);

  const onSortField = (field, type) => {
    setSortField(field);
    setSortType(type);
  };

  const handleImportDataset = url => {
    const catalogURL = window.location.pathname;

    setShowImportModal(false);

    const header = {
      Accept: 'application/json'
    };

    const getInit = {
      headers: header,
      credentials: 'same-origin'
    };

    return axios
      .post(`${catalogURL}`, url, getInit)
      .then(response => {
        window.location.replace(
          `${catalogURL}/${_.get(response, ['data', 'id'])}`
        );
      })
      .catch(response => {
        const { error } = response;
        return Promise.reject(error);
      });
  };

  return (
    <div>
      <div className="d-flex mb-3">
        <button
          type="button"
          className="fdk-button fdk-button-cta"
          onClick={() => onClickCreateDataset(catalogId)}
        >
          <i className="fa fa-plus fdk-color0 mr-2" />
          {localization.datasets.list.btnNewDataset}
        </button>
        <button
          type="button"
          className="ml-2 transparentButton"
          onClick={toggleShowImportModal}
        >
          <i className="fa fa-plus fdk-color1 mr-2" />
          {localization.datasets.list.btnImportDataset}
        </button>
      </div>

      <ListItems
        catalogId={catalogId}
        items={datasetItems}
        sortField={sortField}
        sortType={sortType}
        onSortField={onSortField}
        prefixPath={`/catalogs/${catalogId}/datasets`}
      />

      <ImportModal
        modal={showImportModal}
        handleAction={handleImportDataset}
        toggle={toggleShowImportModal}
        title={localization.datasets.import.title}
        body={localization.datasets.import.body}
        setURL={localization.datasets.import.setURL}
        btnCancel={localization.app.cancel}
        btnConfirm={localization.app.import}
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
