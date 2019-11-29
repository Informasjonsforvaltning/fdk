import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { parse } from 'qs';

import { getTranslateText } from '../../services/translateText';
import localization from '../../services/localization';
import { AlertMessage } from '../../components/alert-message/alert-message.component';
import { FormTemplateWithState } from '../../components/form-template/form-template-with-state.component';
import { ConnectedFormMeta } from './form-meta/connected-form-meta';
import { ConnectedFormApiServiceType } from './form-api-service-type/connected-form-api-service-type';
import { ConnectedFormAccess } from './form-access/connected-form-access';
import { FormRelatedDatasets } from './form-relatedDatasets/form-related-datasets';
import { ConnectedFormApiStatus } from './form-apiStatus/connected-form-apiStatus';
import { FormPublish } from './form-publish/form-publish';
import { APISpecificationInfo } from './api-specification-info.component';

async function deleteAndNavigateToList({
  history,
  catalogId,
  apiId,
  dispatchDeleteApi
}) {
  await dispatchDeleteApi(catalogId, apiId);
  if (history) {
    history.push({
      pathname: `/catalogs/${catalogId}/apis`,
      state: { confirmDelete: true }
    });
  }
}

export const ApiRegistrationPagePure = ({
  catalogId,
  apiId,
  dispatchEnsureData,
  dispatchDeleteApi,
  catalogItem,
  isSaving,
  error,
  justPublishedOrUnPublished,
  item,
  location,
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
  const searchQuery =
    parse(_.get(location, 'search'), { ignoreQueryPrefix: true }) || {};
  const info = _.get(item, ['apiSpecification', 'info']);

  useEffect(dispatchEnsureData, [catalogId, apiId]);

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
                <ConnectedFormAccess apiItem={item} />
              </FormTemplateWithState>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-12">
              <FormTemplateWithState
                showInitially
                title={localization.schema.apiMeta.title}
              >
                <ConnectedFormMeta apiItem={item} />
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
                <FormRelatedDatasets
                  apiItem={item}
                  referencedDatasets={referencedDatasets}
                />
              </FormTemplateWithState>
            </div>
          </div>

          <FormPublish
            initialItemStatus={_.get(item, 'registrationStatus', '')}
            apiItem={item}
            type="api"
            isSaving={isSaving}
            lastSaved={item._lastModified}
            error={error}
            justPublishedOrUnPublished={justPublishedOrUnPublished}
            onDelete={() =>
              deleteAndNavigateToList({
                history,
                catalogId,
                apiId,
                dispatchDeleteApi
              })
            }
          />
        </>
      )}
    </div>
  );
};

ApiRegistrationPagePure.defaultProps = {
  dispatchEnsureData: _.noop,
  dispatchDeleteApi: _.noop,
  catalogItem: null,
  isSaving: false,
  error: null,
  justPublishedOrUnPublished: false,
  apiStatusItems: null,
  apiServiceTypeItems: null,
  item: null,
  location: null,
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
  catalogId: PropTypes.string.isRequired,
  apiId: PropTypes.string.isRequired,
  dispatchEnsureData: PropTypes.func,
  dispatchDeleteApi: PropTypes.func,
  catalogItem: PropTypes.object,
  isSaving: PropTypes.bool,
  error: PropTypes.object,
  justPublishedOrUnPublished: PropTypes.bool,
  apiStatusItems: PropTypes.array,
  apiServiceTypeItems: PropTypes.array,
  item: PropTypes.object,
  location: PropTypes.object,
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
