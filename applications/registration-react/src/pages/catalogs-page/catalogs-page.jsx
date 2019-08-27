import React from 'react';
import PropTypes from 'prop-types';
import { CardGroup } from 'reactstrap';
import _ from 'lodash';
import localization from '../../lib/localization';
import { Catalog } from './catalogs/catalogs.component';
import './catalogs-page.scss';

const renderPublishers = (publishers, fetchers) =>
  Array.isArray(publishers) &&
  publishers.map(({ id, name, catalogs }) => (
    <div key={id} className="row mb-2 mb-md-5">
      <div className="col-12">
        <h2 className="fdk-text-strong mb-4">{name}</h2>
        <CardGroup>
          {Array.isArray(catalogs) &&
            catalogs.map(
              ({ type, available, count }) =>
                available && (
                  <Catalog
                    key={`${type}-${id}`}
                    catalogId={id}
                    type={type}
                    itemsCount={count}
                    fetchItems={fetchers[type]}
                  />
                )
            )}
        </CardGroup>
      </div>
    </div>
  ));

export const RegCatalogs = props => {
  const {
    isFetching,
    fetchCatalogsIfNeeded,
    fetchDatasetsIfNeeded,
    fetchApisIfNeeded,
    publishers
  } = props;
  fetchCatalogsIfNeeded();

  const fetchers = {
    datasets: fetchDatasetsIfNeeded,
    apis: fetchApisIfNeeded
  };

  return (
    <div className="container">
      {publishers && renderPublishers(publishers, fetchers)}
      {!isFetching &&
        !!publishers &&
        publishers.length === 0 && (
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
                <p>
                  <a href="https://fellesdatakatalog.brreg.no/about-registration">
                    {localization.catalogs.missingCatalogs.accessText}
                    <i className="fa fa-external-link fdk-fa-right" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

RegCatalogs.defaultProps = {
  publishers: [],
  isFetching: false,
  fetchCatalogsIfNeeded: _.noop
};

RegCatalogs.propTypes = {
  publishers: PropTypes.array,
  isFetching: PropTypes.bool,
  fetchCatalogsIfNeeded: PropTypes.func
};
