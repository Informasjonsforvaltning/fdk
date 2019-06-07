import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { parse } from 'qs';
import axios from 'axios';

import { getTranslateText } from '../../lib/translateText';
import localization from '../../lib/localization';
import { AlertMessage } from '../../components/alert-message/alert-message.component';
import { FormTemplateWithState } from '../../components/form-template/form-template-with-state.component';
import { ConnectedFormMeta } from './form-meta/connected-form-meta';
import { ConnectedFormApiServiceType } from './form-api-service-type/connected-form-api-service-type';
import { ConnectedFormAccess } from './form-access/connected-form-access';
import { ConnectedFormRelatedDatasets } from './form-relatedDatasets/connected-form-related-datasets';
import { ConnectedFormApiStatus } from './form-apiStatus/connected-form-apiStatus';
import { StatusBar } from '../../components/status-bar/status-bar.component';
import { ConnectedFormPublish } from './connected-form-publish/connected-form-publish';
import { APISpecificationInfo } from './api-specification-info.component';

export const ApiRegistrationPagePure = ({
  onAfterRender,
  deleteApiItem,
  catalogItem,
  isSaving,
  error,
  justPublishedOrUnPublished,
  registrationStatus,
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
  apiStatusItems,
  apiServiceTypeItems
}) => {
  const catalogId = _.get(match, ['params', 'catalogId']);
  const apiId = _.get(match, ['params', 'id']);
  const searchQuery =
    parse(_.get(location, 'search'), { ignoreQueryPrefix: true }) || {};
  const info = _.get(item, ['apiSpecification', 'info']);

  useEffect(onAfterRender);

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
        <>
          <div className="row mb-5">
            <div className="col-12">
              <FormTemplateWithState
                showInitially
                title={localization.schema.apiAccess.title}
              >
                <ConnectedFormAccess apiItem={item} match={match} />
              </FormTemplateWithState>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-12">
              <FormTemplateWithState
                showInitially
                title={localization.schema.apiMeta.title}
              >
                <ConnectedFormMeta apiItem={item} match={match} />
              </FormTemplateWithState>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-12">
              <FormTemplateWithState
                showInitially
                title={localization.schema.apiServiceType.title}
              >
                <ConnectedFormApiServiceType
                  apiItem={item}
                  match={match}
                  apiServiceTypeItems={apiServiceTypeItems}
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
                  referencedDatasets={referencedDatasets}
                />
              </FormTemplateWithState>
            </div>
          </div>

          <StatusBar
            type="api"
            isSaving={isSaving}
            lastSaved={item._lastModified}
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
        </>
      )}
    </div>
  );
};

ApiRegistrationPagePure.defaultProps = {
  onAfterRender: _.noop,
  deleteApiItem: _.noop,
  catalogItem: null,
  isSaving: false,
  error: null,
  justPublishedOrUnPublished: false,
  registrationStatus: null,
  apiStatusItems: null,
  apiServiceTypeItems: null,
  item: null,
  location: null,
  match: null,
  publisher: null,
  referencedDatasets: null,
  showImportError: false,
  showImportSuccess: false,
  showImportSpecificationButtons: false,
  onToggleShowImportSpecificationButtons: _.noop,
  handleShowImportError: _.noop,
  handleShowImportSuccess: _.noop,
  apiSuccess: _.noop,
  history: null
};

ApiRegistrationPagePure.propTypes = {
  onAfterRender: PropTypes.func,
  deleteApiItem: PropTypes.func,
  catalogItem: PropTypes.object,
  isSaving: PropTypes.bool,
  error: PropTypes.object,
  justPublishedOrUnPublished: PropTypes.bool,
  registrationStatus: PropTypes.string,
  apiStatusItems: PropTypes.array,
  apiServiceTypeItems: PropTypes.array,
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
