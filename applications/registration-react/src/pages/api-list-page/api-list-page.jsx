import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { withState, withHandlers, compose } from 'recompose';

import localization from '../../utils/localization';
import ListItems from '../../components/list-items/list-items.component';
import getTranslateText from '../../utils/translateText';
import { validateURL } from '../../validation/validation';
import { postApiCatalogLink } from '../../api/post-apiCatalog-link';
import { AlertMessage } from '../../components/alert-message/alert-message.component';

const harvestApiSpec = props => {
  const {
    harvestUrl,
    match,
    invalidateApiCatalogItemAction,
    invalidateApiItemAction
  } = props;
  const catalogId = _.get(match, ['params', 'catalogId']);

  postApiCatalogLink(catalogId, harvestUrl)
    .then(() => {
      invalidateApiCatalogItemAction(catalogId);
      invalidateApiItemAction(catalogId);
      props.setHarvestApiSuccess(true);
    })
    .catch(error => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('error', error); // eslint-disable-line no-console
      }
      props.setHarvestApiError(true);
    });
};

const alertDeleted = confirmDelete => {
  if (!confirmDelete) {
    return null;
  }
  return (
    <div className="row mb-5">
      <div className="col-12">
        <AlertMessage type="success">
          {localization.formStatus.type.api}{' '}
          {localization.formStatus.confirmDeleted}
        </AlertMessage>
      </div>
    </div>
  );
};

const alertHarvestSuccess = (harvestApiSuccess, harvestUrl) => {
  if (!harvestApiSuccess) {
    return null;
  }
  return (
    <div className="row mb-5">
      <div className="col-12">
        <AlertMessage type="success">
          {localization.api.register.importFromSpecPart1} {`${harvestUrl} `}
          {localization.api.register.importFromSpecPart2}
        </AlertMessage>
      </div>
    </div>
  );
};

const alertHarvestError = (harvestApiError, harvestUrl) => {
  if (!harvestApiError) {
    return null;
  }
  return (
    <div className="row mb-5">
      <div className="col-12">
        <AlertMessage type="danger">
          {localization.api.register.importFromSpecPart1} {`${harvestUrl} `}
          {localization.api.register.importFromSpecPart2Error}
        </AlertMessage>
      </div>
    </div>
  );
};

export const APIListPage = props => {
  const {
    apiCatalogs,
    catalogItem,
    registeredApiItems,
    harvestedApiItems,
    fetchCatalogIfNeeded,
    fetchApisIfNeeded,
    fetchApiCatalogIfNeeded,
    invalidateApiCatalogItemAction,
    invalidateApiItemAction,
    match,
    showHarvestLink,
    onToggle,
    handleChangeUrl,
    harvestUrl,
    harvestApiSuccess,
    harvestApiError,
    touched,
    error,
    location
  } = props;

  const catalogId = _.get(match, ['params', 'catalogId']);
  if (catalogId) {
    fetchCatalogIfNeeded(catalogId);
    fetchApisIfNeeded(catalogId);
    fetchApiCatalogIfNeeded(catalogId);
  }

  if (
    _.get(apiCatalogs, 'harvestSourceUri') &&
    !(
      _.get(apiCatalogs, 'harvestStatus') ||
      (_.get(apiCatalogs, ['harvestStatus', 'success']) === false &&
        !_.get(apiCatalogs, ['harvestStatus', 'errorMessage']))
    )
  ) {
    invalidateApiCatalogItemAction(catalogId);
    invalidateApiItemAction(catalogId);
    fetchApiCatalogIfNeeded(catalogId);
  }

  return (
    <div className="container">
      {alertDeleted(_.get(location, ['state', 'confirmDelete'], false))}
      {alertHarvestSuccess(harvestApiSuccess, harvestUrl)}
      {alertHarvestError(harvestApiError, harvestUrl)}

      <div className="row mb-5">
        <div className="col-12">
          <h1>{localization.api.register.apiCatalog}</h1>
          <div className="fdk-reg-datasets-publisher mt-2 mb-4">
            {getTranslateText(_.get(catalogItem, ['publisher', 'prefLabel'])) ||
              _.get(catalogItem, ['publisher', 'name'])}
          </div>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-12 d-flex">
          {registeredApiItems &&
            registeredApiItems.length === 0 && (
              <Link
                className="ml-0 mr-3 btn btn-primary fdk-button card-link"
                to={`/catalogs/${catalogId}/apis/import`}
              >
                <i className="fa fa-plus-circle mr-2" />
                {localization.api.register.registerNew}
              </Link>
            )}

          {!apiCatalogs &&
            !showHarvestLink && (
              <Button
                className="mr-3 btn btn-primary fdk-button"
                color="primary"
                onClick={onToggle}
              >
                <i className="fa fa-plus-circle mr-2" />
                {localization.api.harvest.harvestFromCatalog}
              </Button>
            )}
          {!apiCatalogs &&
            showHarvestLink && (
              <React.Fragment>
                <label className="d-flex flex-grow-1 mb-0" htmlFor="importUrl">
                  <span className="align-self-center">
                    {localization.api.harvest.labelHarvestUrl}
                  </span>
                  <input
                    name="importUrl"
                    onChange={e => handleChangeUrl(e)}
                    type="input"
                    className="ml-2 py-2 px-4 flex-grow-1"
                    autoComplete="off"
                  />
                </label>
                <Button
                  className="ml-3 btn btn-primary fdk-button"
                  color="primary"
                  disabled={!touched || !!error || harvestUrl === ''}
                  onClick={() => harvestApiSpec(props)}
                >
                  {localization.api.harvest.harvestAction}
                </Button>
                <button
                  className="btn bg-transparent fdk-color-blue-dark"
                  onClick={onToggle}
                >
                  {localization.app.cancel}
                </button>
              </React.Fragment>
            )}
        </div>
        {touched &&
          error && (
            <div className="col-12 mt-3">
              <div className="alert alert-danger">{error}</div>
            </div>
          )}
      </div>

      {apiCatalogs &&
        harvestedApiItems && (
          <React.Fragment>
            <div className="row mb-5">
              <div className="col-12">
                <h2 className="mb-4">
                  {localization.api.harvest.harvestedFromCatalogTitle}
                </h2>

                {!showHarvestLink && (
                  <React.Fragment>
                    <span>{apiCatalogs.harvestSourceUri}</span>
                    <button
                      className="btn bg-transparent fdk-color-blue-dark"
                      onClick={onToggle}
                    >
                      <i className="fa fa-pencil mr-2" />
                      {localization.api.harvest.changeHarvestUrl}
                    </button>
                  </React.Fragment>
                )}
                {showHarvestLink && (
                  <div className="d-flex">
                    <label className="d-flex flex-grow-1" htmlFor="importUrl">
                      <span className="align-self-center">
                        {localization.api.harvest.labelHarvestUrl}
                      </span>
                      <input
                        name="importUrl"
                        onChange={e => handleChangeUrl(e)}
                        type="input"
                        className="ml-2 py-2 px-4 flex-grow-1"
                        autoComplete="off"
                        defaultValue={apiCatalogs.harvestSourceUri}
                      />
                    </label>
                    <Button
                      className="ml-3 btn btn-primary fdk-button"
                      color="primary"
                      disabled={!touched || !!error || harvestUrl === ''}
                      onClick={() => harvestApiSpec(props)}
                    >
                      {localization.api.harvest.harvestAction}
                    </Button>
                    <button
                      className="btn bg-transparent fdk-color-blue-dark"
                      onClick={onToggle}
                    >
                      {localization.app.cancel}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-2 mb-5">
              <div className="col-12 fdk-reg-datasets-list">
                <ListItems
                  catalogId={catalogId}
                  items={harvestedApiItems}
                  itemTitleField={['openApi', 'info', 'title']}
                  prefixPath={`/catalogs/${catalogId}/apis`}
                  defaultEmptyListText={localization.listItems.missingApiItems}
                />
              </div>
            </div>
          </React.Fragment>
        )}

      {catalogItem &&
        registeredApiItems &&
        registeredApiItems.length > 0 && (
          <React.Fragment>
            <div className="row mb-5">
              <div className="col-12">
                <h2 className="mb-4">
                  {localization.api.register.registeredApiTitle}
                </h2>
                <Link
                  className="ml-0 btn btn-primary fdk-button card-link"
                  to={`/catalogs/${catalogId}/apis/import`}
                >
                  <i className="fa fa-plus-circle mr-2" />
                  {localization.api.register.registerNew}
                </Link>
              </div>
            </div>

            <div className="row mb-2 mb-5">
              <div className="col-12 fdk-reg-datasets-list">
                <ListItems
                  catalogId={catalogId}
                  items={registeredApiItems}
                  itemTitleField={['openApi', 'info', 'title']}
                  prefixPath={`/catalogs/${catalogId}/apis`}
                  defaultEmptyListText={localization.listItems.missingApiItems}
                />
              </div>
            </div>
          </React.Fragment>
        )}
    </div>
  );
};

APIListPage.defaultProps = {
  apiCatalogs: null,
  catalogItem: null,
  fetchCatalogIfNeeded: _.noop(),
  fetchApisIfNeeded: _.noop(),
  fetchApiCatalogIfNeeded: _.noop(),
  invalidateApiCatalogItemAction: _.noop(),
  invalidateApiItemAction: _.noop(),
  match: null,
  registeredApiItems: null,
  harvestedApiItems: null,
  showHarvestLink: false,
  onToggle: _.noop(),
  handleChangeUrl: _.noop(),
  harvestUrl: null,
  harvestApiSuccess: false,
  harvestApiError: false,
  touched: false,
  error: null,
  location: null
};

APIListPage.propTypes = {
  apiCatalogs: PropTypes.object,
  catalogItem: PropTypes.object,
  registeredApiItems: PropTypes.array,
  harvestedApiItems: PropTypes.array,
  fetchCatalogIfNeeded: PropTypes.func,
  fetchApisIfNeeded: PropTypes.func,
  fetchApiCatalogIfNeeded: PropTypes.func,
  invalidateApiCatalogItemAction: PropTypes.func,
  invalidateApiItemAction: PropTypes.func,
  match: PropTypes.object,
  showHarvestLink: PropTypes.bool,
  onToggle: PropTypes.func,
  handleChangeUrl: PropTypes.func,
  harvestUrl: PropTypes.string,
  harvestApiSuccess: PropTypes.bool,
  harvestApiError: PropTypes.bool,
  touched: PropTypes.bool,
  error: PropTypes.string,
  location: PropTypes.object
};

const enhance = compose(
  withState('showHarvestLink', 'toggleShowHarvestLink', false),
  withState('harvestUrl', 'setHarvestUrl', ''),
  withState('harvestApiSuccess', 'setHarvestApiSuccess', false),
  withState('harvestApiError', 'setHarvestApiError', false),
  withState('touched', 'setTouched', false),
  withState('error', 'setError', ''),
  withHandlers({
    onToggle: props => e => {
      e.preventDefault();
      props.setError('');
      props.toggleShowHarvestLink(!props.showHarvestLink);
    },
    handleChangeUrl: props => e => {
      props.setHarvestUrl(e.target.value);
      props.setTouched(true);
      const inputValue = _.get(e, ['target', 'value']);
      let errors = {};
      errors = validateURL('importUrlValidation', inputValue, errors);
      if (errors) {
        props.setError(_.get(errors, 'importUrlValidation'));
      }
    }
  })
);

export const EnhancedAPIListPage = enhance(APIListPage);
