import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import localization from '../../lib/localization';
import { FormCatalog } from './form-catalog/form-catalog';
import { DatasetItemsList } from './items-list/dataset-item-list.component';
import { AlertMessage } from '../../components/alert-message/alert-message.component';
import './dataset-list-page.scss';

export const DatasetsListPagePure = props => {
  const {
    catalogId,
    catalog,
    datasetItems,
    fetchCatalogIfNeeded,
    fetchDatasetsIfNeeded,
    location
  } = props;

  if (catalogId) {
    fetchCatalogIfNeeded(catalogId);
    fetchDatasetsIfNeeded(catalogId);
  }

  return (
    <div className="container">
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
              catalogId={catalogId}
              datasetItems={datasetItems}
              defaultEmptyListText={localization.listItems.missingDatasetItems}
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
  fetchCatalogIfNeeded: () => {},
  fetchDatasetsIfNeeded: () => {},
  location: null
};

DatasetsListPagePure.propTypes = {
  catalogId: PropTypes.string.isRequired,
  catalog: PropTypes.object,
  datasetItems: PropTypes.array,
  fetchCatalogIfNeeded: PropTypes.func,
  fetchDatasetsIfNeeded: PropTypes.func,
  location: PropTypes.object
};
