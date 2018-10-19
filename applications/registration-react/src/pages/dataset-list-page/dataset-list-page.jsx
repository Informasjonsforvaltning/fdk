import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import localization from '../../utils/localization';
import { getDatasetItemsByCatalogId } from '../../redux/modules/datasets';
import FormCatalog from './form-catalog/connected-form-catalog.component';
import DatasetItemsList from './items-list/item-list.component';
import './dataset-list-page.scss';

export const DatasetsListPage = props => {
  const {
    helptextItems,
    catalog,
    datasets,
    fetchHelptextsIfNeeded,
    fetchCatalogIfNeeded,
    fetchDatasetsIfNeeded,
    match
  } = props;

  const catalogId = _.get(match, ['params', 'catalogId']);
  if (catalogId) {
    fetchCatalogIfNeeded(catalogId);
    fetchDatasetsIfNeeded(catalogId);
  }

  fetchHelptextsIfNeeded();

  return (
    <div className="container">
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
                datasetItems={getDatasetItemsByCatalogId(
                  datasets,
                  _.get(catalog, ['items', catalogId, 'id'])
                )}
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
  datasets: null,
  fetchHelptextsIfNeeded: () => {},
  fetchCatalogIfNeeded: () => {},
  fetchDatasetsIfNeeded: () => {},
  match: null
};

DatasetsListPage.propTypes = {
  helptextItems: PropTypes.object,
  catalog: PropTypes.object,
  datasets: PropTypes.object,
  fetchHelptextsIfNeeded: PropTypes.func,
  fetchCatalogIfNeeded: PropTypes.func,
  fetchDatasetsIfNeeded: PropTypes.func,
  match: PropTypes.object
};
