import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { parse } from 'qs';
import axios from 'axios';
import { withState, withHandlers, compose } from 'recompose';

import getTranslateText from '../../lib/translateText';
import localization from '../../lib/localization';
import { AlertMessage } from '../../components/alert-message/alert-message.component';
import { FormTemplateWithState } from '../../components/form-template/form-template-with-state.component';
import { ConnectedFormMeta } from './form-meta/connected-form-meta';
import { ConnectedFormAccess } from './form-access/connected-form-access';
import { ConnectedFormRelatedDatasets } from './form-relatedDatasets/connected-form-related-datasets';
import { ConnectedFormApiStatus } from './form-apiStatus/connected-form-apiStatus';
import { StatusBarWithState } from '../../components/status-bar/status-bar.component';
import { ConnectedFormPublish } from './connected-form-publish/connected-form-publish';
import { APISpecificationInfo } from './api-specification-info.component';

export const APIRegistrationPagePure = ({
  fetchCatalogIfNeeded,
  fetchApisIfNeeded,
  fetchHelptextsIfNeeded,
  fetchApiStatusIfNeeded,
  deleteApiItem,
  catalogItem,
  lastSaved,
  isSaving,
  error,
  justPublishedOrUnPublished,
  registrationStatus,
  helptextItems,
  item,
  location,
  match,
  publisher,
  referencedDatasets,
  showImportError,
  showImportSuccess,
  showImportSpecificationButtons,
  onToggleShowImportSpecificationButtons,
  handleShowImportError,
  handleShowImportSuccess,
  apiSuccess,
  history,
  apiStatusItems
}) => {
  const catalogId = _.get(match, ['params', 'catalogId']);
  const apiId = _.get(match, ['params', 'id']);
  const searchQuery =
    parse(_.get(location, 'search'), { ignoreQueryPrefix: true }) || {};
  const info = _.get(item, ['apiSpecification', 'info']);

  fetchCatalogIfNeeded(catalogId);
  fetchApisIfNeeded(catalogId);
  fetchHelptextsIfNeeded();
  fetchApiStatusIfNeeded();

  const deleteApi = () => {
    // const { history, match } = props;
    const api = {
      Authorization: `Basic user:password`
    };

    return axios
      .delete(match.url, { headers: api })
      .then(() => {
        deleteApiItem(catalogId, _.get(item, 'id'));
        if (history) {
          history.push({
            pathname: `/catalogs/${catalogId}/apis`,
            state: { confirmDelete: true }
          });
        }
      })
      .catch(response => {
        const { error } = response;
        return Promise.reject(error);
      });
  };

  return (
    <div className="container">
      <div className="row mb-5">
        <div className="col-12">
          <h1>{_.get(info, 'title')}</h1>
          <div className="fdk-reg-datasets-publisher mt-2 mb-4">
            {getTranslateText(_.get(catalogItem, ['publisher', 'prefLabel'])) ||
              _.get(catalogItem, ['publisher', 'name'])}
          </div>
        </div>
      </div>

      {_.get(searchQuery, 'importSuccess') && (
        <div className="row mb-5">
          <div className="col-12">
            <AlertMessage type="success">
              {localization.formatString(
                localization.api.register.importFromSpecSuccess,
                _.get(searchQuery, 'importSuccess')
              )}
            </AlertMessage>
          </div>
        </div>
      )}

      {showImportSuccess && (
        <div className="row mb-5">
          <div className="col-12">
            <AlertMessage type="success">
              {localization.formatString(
                localization.api.register.importFromSpecSuccess,
                localization.specification
              )}
            </AlertMessage>
          </div>
        </div>
      )}

      {showImportError && (
        <div className="row mb-5">
          <div className="col-12">
            <AlertMessage type="danger">
              {localization.formatString(
                localization.api.register.importFromSpecError,
                localization.specification
              )}
            </AlertMessage>
          </div>
        </div>
      )}

      <div className="row mb-5">
        <div className="col-12">
          <APISpecificationInfo
            info={info}
            paths={_.get(item, ['apiSpecification', 'paths'])}
            fromApiCatalog={_.get(item, 'fromApiCatalog')}
            showImportSpecificationButtons={showImportSpecificationButtons}
            handleShowImportSpecificationButtons={
              onToggleShowImportSpecificationButtons
            }
            catalogId={catalogId}
            apiId={apiId}
            handleShowImportError={handleShowImportError}
            handleShowImportSuccess={handleShowImportSuccess}
            apiSuccess={apiSuccess}
          />
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-12">
          <h3>Tilleggsinformasjon</h3>
          <span>{localization.api.register.addInfo}</span>
        </div>
      </div>

      {item && (
        <React.Fragment>
          <div className="row mb-5">
            <div className="col-12">
              <FormTemplateWithState
                showInitially
                title={localization.schema.apiMeta.title}
              >
                <ConnectedFormMeta
                  apiItem={item}
                  match={match}
                  helptextItems={helptextItems}
                />
              </FormTemplateWithState>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-12">
              <FormTemplateWithState
                showInitially
                title={localization.schema.apiAccess.title}
              >
                <ConnectedFormAccess
                  apiItem={item}
                  match={match}
                  helptextItems={helptextItems}
                />
              </FormTemplateWithState>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-12">
              <FormTemplateWithState
                showInitially
                title={localization.schema.apiStatus.title}
              >
                <ConnectedFormApiStatus
                  match={match}
                  apiItem={item}
                  apiStatusItems={apiStatusItems}
                  helptextItems={helptextItems}
                />
              </FormTemplateWithState>
            </div>
          </div>

          <div className="row mb-5">
            <div className="col-12">
              <FormTemplateWithState
                showInitially
                title={localization.schema.apiDatasetReferences.title}
              >
                <ConnectedFormRelatedDatasets
                  apiItem={item}
                  match={match}
                  orgPath={_.get(publisher, 'orgPath')}
                  helptextItems={helptextItems}
                  referencedDatasets={referencedDatasets}
                />
              </FormTemplateWithState>
            </div>
          </div>

          <StatusBarWithState
            type="api"
            isSaving={isSaving}
            lastSaved={lastSaved}
            published={
              registrationStatus
                ? !!(registrationStatus === 'PUBLISH')
                : !!(_.get(item, 'registrationStatus', 'DRAFT') === 'PUBLISH')
            }
            error={error}
            justPublishedOrUnPublished={justPublishedOrUnPublished}
            onDelete={deleteApi}
            formComponent={
              <ConnectedFormPublish
                initialItemStatus={_.get(item, 'registrationStatus', '')}
                match={match}
              />
            }
          />
        </React.Fragment>
      )}
    </div>
  );
};

APIRegistrationPagePure.defaultProps = {
  fetchCatalogIfNeeded: _.noop(),
  fetchApisIfNeeded: _.noop,
  fetchHelptextsIfNeeded: _.noop(),
  fetchApiStatusIfNeeded: _.noop(),
  deleteApiItem: _.noop(),
  catalogItem: null,
  lastSaved: null,
  isSaving: false,
  error: null,
  justPublishedOrUnPublished: false,
  registrationStatus: null,
  helptextItems: null,
  apiStatusItems: null,
  item: null,
  location: null,
  match: null,
  publisher: null,
  referencedDatasets: null,
  showImportError: false,
  showImportSuccess: false,
  showImportSpecificationButtons: false,
  onToggleShowImportSpecificationButtons: _.noop(),
  handleShowImportError: _.noop(),
  handleShowImportSuccess: _.noop(),
  apiSuccess: _.noop(),
  history: null
};

APIRegistrationPagePure.propTypes = {
  fetchCatalogIfNeeded: PropTypes.func,
  fetchApisIfNeeded: PropTypes.func,
  fetchHelptextsIfNeeded: PropTypes.func,
  fetchApiStatusIfNeeded: PropTypes.func,
  deleteApiItem: PropTypes.func,
  catalogItem: PropTypes.object,
  lastSaved: PropTypes.string,
  isSaving: PropTypes.bool,
  error: PropTypes.number,
  justPublishedOrUnPublished: PropTypes.bool,
  registrationStatus: PropTypes.string,
  helptextItems: PropTypes.object,
  apiStatusItems: PropTypes.array,
  item: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  publisher: PropTypes.object,
  referencedDatasets: PropTypes.array,
  showImportError: PropTypes.bool,
  showImportSuccess: PropTypes.bool,
  showImportSpecificationButtons: PropTypes.bool,
  onToggleShowImportSpecificationButtons: PropTypes.func,
  handleShowImportError: PropTypes.func,
  handleShowImportSuccess: PropTypes.func,
  apiSuccess: PropTypes.func,
  history: PropTypes.object
};

const enhance = compose(
  withState(
    'showImportSpecificationButtons',
    'toggleShowImportSpecificationButtons',
    false
  ),
  withState('showImportError', 'setShowImportError', false),
  withState('showImportSuccess', 'setShowImportSuccess', false),
  withHandlers({
    onToggleShowImportSpecificationButtons: props => e => {
      if (e) {
        e.preventDefault();
      }
      props.toggleShowImportSpecificationButtons(
        !props.showImportSpecificationButtons
      );
    },
    handleShowImportError: props => value => {
      props.setShowImportError(value);
    },
    handleShowImportSuccess: props => value => {
      props.setShowImportSuccess(value);
    }
  })
);

export const APIRegistrationPageWithState = enhance(APIRegistrationPagePure);
export const APIRegistrationPage = APIRegistrationPageWithState;
