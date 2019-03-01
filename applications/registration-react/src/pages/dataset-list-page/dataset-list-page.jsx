import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import localization from '../../lib/localization';
import FormCatalog from './form-catalog/connected-form-catalog.component';
import DatasetItemsList from './items-list/item-list.component';
import { AlertMessage } from '../../components/alert-message/alert-message.component';
import './dataset-list-page.scss';

export const DatasetsListPage = props => {
  const {
    helptextItems,
    catalog,
    datasetItems,
    fetchHelptextsIfNeeded,
    fetchCatalogIfNeeded,
    fetchDatasetsIfNeeded,
    match,
    location
  } = props;

  const catalogId = _.get(match, ['params', 'catalogId']);
  if (catalogId) {
    fetchCatalogIfNeeded(catalogId);
    fetchDatasetsIfNeeded(catalogId);
  }

  fetchHelptextsIfNeeded();

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
        {helptextItems &&
          _.get(catalog, ['items', catalogId]) && (
            <div className="col-12 fdk-reg-datasets-list">
              <FormCatalog
                catalogId={catalogId}
                helptextItems={helptextItems}
              />
              <DatasetItemsList
                catalogId={catalogId}
                datasetItems={datasetItems}
                defaultEmptyListText={
                  localization.listItems.missingDatasetItems
                }
              />
            </div>
          )}
      </div>
    </div>
  );
};

DatasetsListPage.defaultProps = {
  helptextItems: null,
  catalog: null,
  datasetItems: null,
  fetchHelptextsIfNeeded: () => {},
  fetchCatalogIfNeeded: () => {},
  fetchDatasetsIfNeeded: () => {},
  match: null,
  location: null
};

DatasetsListPage.propTypes = {
  helptextItems: PropTypes.object,
  catalog: PropTypes.object,
  datasetItems: PropTypes.array,
  fetchHelptextsIfNeeded: PropTypes.func,
  fetchCatalogIfNeeded: PropTypes.func,
  fetchDatasetsIfNeeded: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object
};
