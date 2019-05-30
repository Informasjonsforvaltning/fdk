import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import localization from '../../lib/localization';
import { FormTemplateWithState } from '../../components/form-template/form-template-with-state.component';
import { ConnectedFormTitle } from './form-title/connected-form-title.component';
import { FormDistribution } from './form-distribution/form-distribution';
import { ConnectedFormSample } from './form-sample/connected-form-sample.component';
import { ConnectedFormSpatial } from './form-spatial/connected-form-spatial.component';
import { ConnectedFormProvenance } from './form-provenance/connected-form-provenance.component';
import { ConnectedFormThemes } from './form-theme/connected-form-theme.component';
import { ConnectedFormType } from './form-type/connected-form-type.component';
import { ConnectedFormConcept } from './form-concept/connected-form-concept.component';
import { ConnectedFormAccessRights } from './form-accessRights/connected-form-accessRights.component';
import { ConnectedFormReference } from './form-reference/connected-form-reference.component';
import { ConnectedFormInformationModel } from './form-informationmodel/connected-form-informationmodel.component';
import { ConnectedFormContactPoint } from './form-contactPoint/connected-form-contactPoint.component';
import { ConnectedFormContents } from './form-contents/connected-form-contents.component';
import { StatusBarWithState } from '../../components/status-bar/status-bar.component';
import { ConnectedFormPublish } from './connected-form-publish/connected-form-publish';
import { FormDistributionApi } from './form-distribution-api/form-distribution-api';
import { ConnectedFormLOS } from './form-los/connected-form-los.component';
import {
  titleValues,
  accessRightsValues,
  themesValues,
  losValues,
  typeValues,
  conceptValues,
  spatialValues,
  provenanceValues,
  contentsValues,
  informationModelValues,
  referenceValues,
  contactPointValues,
  distributionValues,
  distributionAPIValues,
  sampleValues
} from './dataset-registration-page.logic';
import './dataset-registration-page.scss';

const isAllowedToPublish = (
  registrationStatus,
  syncErrors,
  distributionErrors
) => {
  if (registrationStatus === 'DRAFT' && (syncErrors || distributionErrors)) {
    return false;
  }
  return true;
};

async function deleteAndNavigateToList({
  history,
  catalogId,
  datasetId,
  deleteDatasetItem
}) {
  await deleteDatasetItem(catalogId, datasetId);
  if (history) {
    history.push({
      pathname: `/catalogs/${catalogId}/datasets`,
      state: { confirmDelete: true }
    });
  }
}

export function DatasetRegistrationPagePure(props) {
  const {
    form,
    themesItems,
    provenanceItems,
    frequencyItems,
    datasetItem,
    referenceTypesItems,
    referenceDatasetsItems,
    openLicenseItems,
    lastSaved,
    isSaving,
    error,
    justPublishedOrUnPublished,
    registrationStatus,
    catalogId,
    datasetId,
    losItems,
    history,
    deleteDatasetItem
  } = props;

  const datasetURL = window.location.pathname;
  const catalogDatasetsURL = datasetURL.substring(
    0,
    datasetURL.lastIndexOf('/')
  );

  const syncErrors = _.some(_.mapValues(form, subform => subform.syncErrors));
  const distributionErrors = !!_.get(form, ['distribution', 'syncErrors']);

  return (
    <div className="container">
      <div className="row mb-2 mb-md-5">
        <div className="col-md-2">
          <i className="fa fa-arrow-left mr-2" />
          <Link
            className="fdk-text-size-small fdk-color1 font-weight-light"
            to={catalogDatasetsURL}
          >
            {localization.datasets.backToCatalog}
          </Link>
        </div>
        {datasetItem &&
          form &&
          themesItems &&
          provenanceItems &&
          frequencyItems &&
          referenceTypesItems &&
          referenceDatasetsItems &&
          openLicenseItems &&
          losItems && (
            <div className="col-md-8">
              <FormTemplateWithState
                title={localization.datasets.formTemplates.title}
                required
                values={titleValues(form.title && form.title.values)}
                syncErrors={form.title && form.title.syncErrors}
              >
                <ConnectedFormTitle
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.accessRight}
                required
                values={accessRightsValues(
                  form.accessRights && form.accessRights.values
                )}
                syncErrors={form.accessRights && form.accessRights.syncErrors}
              >
                <ConnectedFormAccessRights
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.theme}
                required
                values={losValues(
                  form.formThemes && form.formThemes.values,
                  losItems
                )}
                syncErrors={form.formThemes && form.formThemes.syncErrors}
              >
                <ConnectedFormLOS
                  datasetItem={datasetItem}
                  losItems={losItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.euTheme}
                values={themesValues(form.formThemes && form.formThemes.values)}
                syncErrors={form.formThemes && form.formThemes.syncErrors}
              >
                <ConnectedFormThemes
                  datasetItem={datasetItem}
                  themesItems={themesItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.type}
                values={typeValues(form.type && form.type.values)}
                syncErrors={form.type && form.type.syncErrors}
              >
                <ConnectedFormType
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.concept}
                values={conceptValues(form.concept && form.concept.values)}
                syncErrors={form.concept && form.concept.syncErrors}
              >
                <ConnectedFormConcept
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.spatial}
                values={spatialValues(form.spatial && form.spatial.values)}
                syncErrors={form.spatial && form.spatial.syncErrors}
              >
                <ConnectedFormSpatial
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.provenance}
                values={provenanceValues(
                  form.formProvenance && form.formProvenance.values
                )}
                syncErrors={
                  form.formProvenance && form.formProvenance.syncErrors
                }
              >
                <ConnectedFormProvenance
                  datasetItem={datasetItem}
                  provenanceItems={provenanceItems}
                  frequencyItems={frequencyItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.content}
                values={contentsValues(form.contents && form.contents.values)}
                syncErrors={form.contents && form.contents.syncErrors}
              >
                <ConnectedFormContents
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.informationModel}
                values={informationModelValues(
                  form.informationModel && form.informationModel.values
                )}
                syncErrors={
                  form.informationModel && form.informationModel.syncErrors
                }
              >
                <ConnectedFormInformationModel
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.reference}
                values={referenceValues(
                  form.reference && form.reference.values
                )}
              >
                <ConnectedFormReference
                  datasetItem={datasetItem}
                  referenceTypesItems={referenceTypesItems}
                  referenceDatasetsItems={referenceDatasetsItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.contactInformation}
                values={contactPointValues(
                  form.contactPoint && form.contactPoint.values
                )}
                syncErrors={form.contactPoint && form.contactPoint.syncErrors}
              >
                <ConnectedFormContactPoint
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.distributionAPI}
                values={distributionAPIValues(
                  form.contactPoint && form.contactPoint.values
                )}
              >
                <FormDistributionApi
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                  datasetUri={_.get(datasetItem, 'uri')}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.distribution}
                backgroundBlue
                values={distributionValues(
                  form.distribution && form.distribution.values
                )}
                syncErrors={
                  form.distribution &&
                  form.distribution.syncErrors &&
                  form.distribution.syncErrors.distribution &&
                  JSON.stringify(form.distribution.syncErrors.distribution) !==
                    '{}'
                    ? form.distribution.syncErrors.distribution
                    : null
                }
              >
                <FormDistribution
                  datasetItem={datasetItem}
                  openLicenseItems={openLicenseItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.sample}
                backgroundBlue
                values={sampleValues(form.sample && form.sample.values)}
                syncErrors={
                  form.sample &&
                  form.sample.syncErrors &&
                  form.sample.syncErrors.sample &&
                  form.sample.syncErrors.sample.length > 0
                    ? form.sample.syncErrors.sample
                    : null
                }
              >
                <ConnectedFormSample
                  datasetItem={datasetItem}
                  openLicenseItems={openLicenseItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <StatusBarWithState
                type="dataset"
                isSaving={isSaving}
                lastSaved={lastSaved}
                published={
                  registrationStatus
                    ? !!(registrationStatus === 'PUBLISH')
                    : !!(
                        _.get(datasetItem, 'registrationStatus', 'DRAFT') ===
                        'PUBLISH'
                      )
                }
                error={error}
                justPublishedOrUnPublished={justPublishedOrUnPublished}
                onDelete={() =>
                  deleteAndNavigateToList({
                    history,
                    catalogId,
                    datasetId,
                    deleteDatasetItem
                  })
                }
                allowPublish={isAllowedToPublish(
                  registrationStatus ||
                    _.get(datasetItem, 'registrationStatus', 'DRAFT'),
                  syncErrors,
                  distributionErrors
                )}
                formComponent={
                  <ConnectedFormPublish
                    initialItemStatus={_.get(
                      datasetItem,
                      'registrationStatus',
                      ''
                    )}
                    catalogId={catalogId}
                    datasetId={datasetId}
                  />
                }
              />
            </div>
          )}
        <div className="col-md-2" />
      </div>
    </div>
  );
}

DatasetRegistrationPagePure.defaultProps = {
  catalogId: null,
  datasetId: null,
  themesItems: null,
  provenanceItems: null,
  frequencyItems: null,
  form: {},
  registrationStatus: null,
  lastSaved: null,
  datasetItem: null,
  referenceTypesItems: null,
  referenceDatasetsItems: null,
  openLicenseItems: null,
  isSaving: false,
  error: null,
  justPublishedOrUnPublished: false,
  deleteDatasetItem: _.noop,
  history: null,
  losItems: null
};

DatasetRegistrationPagePure.propTypes = {
  catalogId: PropTypes.string,
  datasetId: PropTypes.string,
  themesItems: PropTypes.array,
  provenanceItems: PropTypes.array,
  frequencyItems: PropTypes.array,
  form: PropTypes.object,
  registrationStatus: PropTypes.string,
  lastSaved: PropTypes.string,
  datasetItem: PropTypes.object,
  referenceTypesItems: PropTypes.array,
  referenceDatasetsItems: PropTypes.array,
  openLicenseItems: PropTypes.array,
  isSaving: PropTypes.bool,
  error: PropTypes.number,
  justPublishedOrUnPublished: PropTypes.bool,
  deleteDatasetItem: PropTypes.func,
  history: PropTypes.object,
  losItems: PropTypes.array
};
