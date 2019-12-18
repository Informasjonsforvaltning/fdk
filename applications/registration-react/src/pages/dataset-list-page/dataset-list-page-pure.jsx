import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import localization from '../../services/localization';
import { FormCatalog } from './form-catalog/form-catalog';
import { DatasetItemsList } from './items-list/dataset-item-list.component';
import { AlertMessage } from '../../components/alert-message/alert-message.component';
import './dataset-list-page.scss';

export const DatasetsListPagePure = props => {
  const {
    isReadOnly,
    catalogId,
    catalog,
    datasetItems,
    location,
    dispatchEnsureData,
    onClickCreateDataset
  } = props;

  useEffect(() => dispatchEnsureData(catalogId), [catalogId]);

  return (
    <div className="container" id="content">
      {_.get(location, ['state', 'confirmDelete'], false) && (
        <div className="row mb-5">
          <div className="col-12">
            <AlertMessage type="success">
              {localization.formStatus.type.dataset}{' '}
              {localization.formStatus.confirmDeleted}
            </AlertMessage>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-12" />
      </div>
      <div className="row mb-2 mb-md-5">
        {_.get(catalog, ['items', catalogId]) && (
          <div className="col-12 fdk-reg-datasets-list">
            <FormCatalog catalogId={catalogId} />
            <DatasetItemsList
              isReadOnly={isReadOnly}
              catalogId={catalogId}
              datasetItems={datasetItems}
              defaultEmptyListText={localization.listItems.missingDatasetItems}
              onClickCreateDataset={onClickCreateDataset}
            />
          </div>
        )}
      </div>
    </div>
  );
};

DatasetsListPagePure.defaultProps = {
  catalog: null,
  datasetItems: null,
  location: null,
  dispatchEnsureData: _.noop,
  onClickCreateDataset: _.noop
};

DatasetsListPagePure.propTypes = {
  catalogId: PropTypes.string.isRequired,
  catalog: PropTypes.object,
  datasetItems: PropTypes.array,
  location: PropTypes.object,
  dispatchEnsureData: PropTypes.func,
  onClickCreateDataset: PropTypes.func
};
