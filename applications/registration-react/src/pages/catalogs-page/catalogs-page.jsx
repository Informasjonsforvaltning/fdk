import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CardGroup } from 'reactstrap';
import _ from 'lodash';
import { FeatureToggle } from 'react-feature-toggles';

import localization from '../../utils/localization';
import { FEATURES } from '../../app-protected-route/features';
import { fetchCatalogsIfNeeded } from '../../redux/modules/catalogs';
import { fetchDatasetsIfNeeded } from '../../redux/modules/datasets';
import { Catalog } from './catalogs/catalogs.component';
import getTranslateText from '../../utils/translateText';
import './catalogs-page.scss';

const renderCatalogs = props => {
  const { catalogItems, datasets, apis, fetchDatasetsIfNeeded } = props;

  if (!catalogItems) {
    return null;
  }

  return catalogItems.map(item => (
    <div key={_.get(item, 'id')} className="row mb-2 mb-md-5">
      <div className="col-12">
        <div>
          <h2 className="fdk-text-strong mb-4">
            {getTranslateText(_.get(item, ['publisher', 'prefLabel'])) ||
              _.get(item, ['publisher', 'name'], '')}
          </h2>
        </div>
        <CardGroup>
          {datasets && (
            <Catalog
              key={`datasets-${item.id}`}
              catalogId={item.id}
              type="datasets"
              fetchItems={fetchDatasetsIfNeeded}
              items={datasets}
            />
          )}
          <FeatureToggle featureName={FEATURES.API}>
            {apis && (
              <Catalog
                key={`apis-${item.id}`}
                catalogId={item.id}
                type="apiSpecs"
                items={apis}
              />
            )}
          </FeatureToggle>
        </CardGroup>
      </div>
    </div>
  ));
};

export const RegCatalogs = props => {
  const { isFetching, catalogItems, fetchCatalogsIfNeeded } = props;
  const catalogsURL = '/catalogs';
  fetchCatalogsIfNeeded(catalogsURL);
  return (
    <div className="container">
      {catalogItems && renderCatalogs(props)}
      {!isFetching &&
        !catalogItems && (
          <div className="row mb-2 mb-md-5">
            <div id="no-catalogs">
              <h1 className="fdk-text-strong">
                {localization.catalogs.missingCatalogs.title}
              </h1>
              <div className="mt-2 mb-2">
                {localization.catalogs.missingCatalogs.ingress}
              </div>
              <div className="fdk-text-size-small">
                <strong>
                  {localization.catalogs.missingCatalogs.accessTitle}
                </strong>
                <p>{localization.catalogs.missingCatalogs.accessText}</p>
                <strong>
                  {localization.catalogs.missingCatalogs.assignAccessTitle}
                </strong>
                <p>{localization.catalogs.missingCatalogs.assignAccessText}</p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

RegCatalogs.defaultProps = {
  catalogItems: null,
  isFetching: false,
  fetchCatalogsIfNeeded: _.noop
};

RegCatalogs.propTypes = {
  catalogItems: PropTypes.array,
  isFetching: PropTypes.bool,
  fetchCatalogsIfNeeded: PropTypes.func
};

function mapStateToProps({ catalogs, datasets, apis }) {
  const { catalogItems, isFetching } = catalogs || {
    catalogItems: null
  };

  return {
    catalogItems,
    datasets,
    apis,
    isFetching
  };
}

const mapDispatchToProps = dispatch => ({
  fetchCatalogsIfNeeded: catalogsURL =>
    dispatch(fetchCatalogsIfNeeded(catalogsURL)),
  fetchDatasetsIfNeeded: catalogId => dispatch(fetchDatasetsIfNeeded(catalogId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegCatalogs);
