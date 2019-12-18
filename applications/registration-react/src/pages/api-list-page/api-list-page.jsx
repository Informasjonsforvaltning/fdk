import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { withState, withHandlers, compose } from 'recompose';

import localization from '../../services/localization';
import { ListItems } from '../../components/list-items/list-items.component';
import { getTranslateText } from '../../services/translateText';
import { validateURL } from '../../validation/validation';
import { AlertMessage } from '../../components/alert-message/alert-message.component';

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

const alertHarvestSuccess = harvestUrl => (
  <div className="row mb-5">
    <div className="col-12">
      <AlertMessage type="success">
        {localization.formatString(
          localization.api.register.importFromSpecSuccess,
          harvestUrl
        )}
      </AlertMessage>
    </div>
  </div>
);

const alertHarvestError = harvestUrl => (
  <div className="row mb-5">
    <div className="col-12">
      <AlertMessage type="danger">
        {localization.formatString(
          localization.api.register.importFromSpecError,
          harvestUrl
        )}
      </AlertMessage>
    </div>
  </div>
);

const renderFailedSpecifications = errorMessage => {
  const list = errorMessage.split(',');
  if (!list) {
    return null;
  }
  return list.map((item, index) => <li key={`item-${index}`}>{item}</li>);
};

const alertHarvestErrorMsg = errorMessage => (
  <div className="row mb-5">
    <div className="col-12">
      <AlertMessage type="danger">
        {localization.api.register.importFromCatalogSomeSpecFailed}
        <ul>{renderFailedSpecifications(errorMessage)}</ul>
      </AlertMessage>
    </div>
  </div>
);

export const APIListPage = props => {
  const {
    apiCatalogs,
    catalogItem,
    registeredApiItems,
    harvestedApiItems,
    fetchCatalogIfNeeded,
    fetchApisIfNeeded,
    fetchApiCatalogIfNeeded,
    postApiCatalogAction,
    match,
    showHarvestLink,
    onToggle,
    handleChangeUrl,
    recentlyPostedHarvestUrl,
    harvestUrl,
    harvestApiError,
    touched,
    error,
    location
  } = props;

  const setApiCatalogUrl = () => {
    const catalogId = _.get(match, ['params', 'catalogId']);
    postApiCatalogAction(catalogId, { harvestSourceUri: harvestUrl });
  };

  const catalogId = _.get(match, ['params', 'catalogId']);
  if (catalogId) {
    fetchCatalogIfNeeded(catalogId);
    fetchApisIfNeeded(catalogId);
    fetchApiCatalogIfNeeded(catalogId);
  }

  return (
    <div className="container">
      {alertDeleted(_.get(location, ['state', 'confirmDelete'], false))}

      {_.get(apiCatalogs, ['harvestStatus', 'success'], false) === true &&
        _.get(apiCatalogs, ['harvestStatus', 'errorMessage']) === undefined &&
        alertHarvestSuccess(
          _.get(apiCatalogs, 'harvestSourceUri', recentlyPostedHarvestUrl)
        )}

      {_.get(apiCatalogs, ['harvestStatus', 'success'], false) === true &&
        _.get(apiCatalogs, ['harvestStatus', 'errorMessage']) &&
        alertHarvestErrorMsg(
          _.get(apiCatalogs, ['harvestStatus', 'errorMessage'])
        )}

      {((_.get(apiCatalogs, ['harvestStatus', 'success']) === false &&
        _.get(apiCatalogs, ['harvestStatus', 'errorMessage'])) ||
        harvestApiError) &&
        alertHarvestError(
          _.get(apiCatalogs, 'harvestSourceUri', recentlyPostedHarvestUrl)
        )}

      <div style={{ marginBottom: '6rem' }} className="row">
        <div className="col-12">
          <h1>{localization.api.register.apiCatalog}</h1>
          <div className="fdk-reg-datasets-publisher">
            {getTranslateText(_.get(catalogItem, ['publisher', 'prefLabel'])) ||
              _.get(catalogItem, ['publisher', 'name'])}
          </div>
        </div>
      </div>

      {!apiCatalogs && (
        <div className="row mb-5">
          <div className="col-12 d-flex">
            {registeredApiItems && registeredApiItems.length === 0 && (
              <Link
                className="ml-0 mr-3 btn btn-primary fdk-button card-link"
                to={`/catalogs/${catalogId}/apis/import`}
              >
                <i className="fa fa-plus-circle mr-2" />
                {localization.api.register.registerNew}
              </Link>
            )}

            {!showHarvestLink && (
              <Button
                className="mr-3 btn btn-primary fdk-button"
                color="primary"
                onClick={onToggle}
              >
                <i className="fa fa-plus-circle mr-2" />
                {localization.api.harvest.harvestFromCatalog}
              </Button>
            )}
            {showHarvestLink && (
              <>
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
                  color={
                    !touched || !!error || harvestUrl === ''
                      ? 'secondary'
                      : 'primary'
                  }
                  disabled={!touched || !!error || harvestUrl === ''}
                  onClick={() => setApiCatalogUrl()}
                >
                  {localization.api.harvest.harvestAction}
                </Button>
                <button
                  type="button"
                  className="btn bg-transparent fdk-color-link"
                  onClick={onToggle}
                >
                  {localization.app.cancel}
                </button>
              </>
            )}
          </div>
          {touched && error && (
            <div className="col-12 mt-3">
              <div className="alert alert-danger">{error}</div>
            </div>
          )}
        </div>
      )}

      {apiCatalogs && harvestedApiItems && (
        <>
          <div className="row mb-2">
            <div className="col-12">
              <h2>{localization.api.harvest.harvestedFromCatalogTitle}</h2>

              {!showHarvestLink && (
                <>
                  <span>{apiCatalogs.harvestSourceUri}</span>
                  <button
                    type="button"
                    className="btn bg-transparent fdk-color-link"
                    onClick={onToggle}
                  >
                    <i className="fa fa-pencil mr-2" />
                    {localization.api.harvest.changeHarvestUrl}
                  </button>
                </>
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
                    type="button"
                    className="ml-3 btn btn-primary fdk-button"
                    color={
                      !touched || !!error || harvestUrl === ''
                        ? 'secondary'
                        : 'primary'
                    }
                    disabled={!touched || !!error || harvestUrl === ''}
                    onClick={() => setApiCatalogUrl()}
                  >
                    {localization.api.harvest.harvestAction}
                  </Button>
                  <button
                    type="button"
                    className="btn bg-transparent fdk-color-link"
                    onClick={onToggle}
                  >
                    {localization.app.cancel}
                  </button>
                </div>
              )}
            </div>
            {touched && error && (
              <div className="col-12 mt-3">
                <div className="alert alert-danger">{error}</div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '6rem' }} className="row">
            {harvestedApiItems.length > 0 && (
              <div className="col-12 fdk-reg-datasets-list">
                <ListItems
                  catalogId={catalogId}
                  items={harvestedApiItems}
                  itemTitleField={['apiSpecification', 'info', 'title']}
                  prefixPath={`/catalogs/${catalogId}/apis`}
                  defaultEmptyListText={localization.listItems.missingApiItems}
                />
              </div>
            )}
          </div>
        </>
      )}

      {registeredApiItems && (
        <>
          {(apiCatalogs || registeredApiItems.length > 0) && (
            <div className="row mb-3">
              <div className="col-12">
                <h2>{localization.api.register.registeredApiTitle}</h2>
                <Link
                  className="ml-0 btn btn-primary fdk-button card-link"
                  to={`/catalogs/${catalogId}/apis/import`}
                >
                  <i className="fa fa-plus-circle mr-2" />
                  {localization.api.register.registerNew}
                </Link>
              </div>
            </div>
          )}
          {registeredApiItems.length > 0 && (
            <div className="row mb-2 mb-5">
              <div className="col-12 fdk-reg-datasets-list">
                <ListItems
                  catalogId={catalogId}
                  items={registeredApiItems}
                  itemTitleField={['apiSpecification', 'info', 'title']}
                  prefixPath={`/catalogs/${catalogId}/apis`}
                  defaultEmptyListText={localization.listItems.missingApiItems}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

APIListPage.defaultProps = {
  apiCatalogs: null,
  catalogItem: null,
  fetchCatalogIfNeeded: _.noop,
  fetchApisIfNeeded: _.noop,
  fetchApiCatalogIfNeeded: _.noop,
  postApiCatalogAction: _.noop,
  match: null,
  registeredApiItems: null,
  harvestedApiItems: null,
  showHarvestLink: false,
  onToggle: _.noop,
  handleChangeUrl: _.noop,
  recentlyPostedHarvestUrl: null,
  harvestUrl: null,
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
  postApiCatalogAction: PropTypes.func,
  match: PropTypes.object,
  showHarvestLink: PropTypes.bool,
  onToggle: PropTypes.func,
  handleChangeUrl: PropTypes.func,
  recentlyPostedHarvestUrl: PropTypes.string,
  harvestUrl: PropTypes.string,
  harvestApiError: PropTypes.bool,
  touched: PropTypes.bool,
  error: PropTypes.string,
  location: PropTypes.object
};

const enhance = compose(
  withState('showHarvestLink', 'toggleShowHarvestLink', false),
  withState('recentlyPostedHarvestUrl', 'setRecentlyPostedHarvestUrl', ''),
  withState('harvestUrl', 'setHarvestUrl', ''),
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
