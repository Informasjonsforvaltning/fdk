import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import localization from '../../utils/localization';
import { FormTemplateWithState } from '../../components/form-template/form-template-with-state.component';
import { ConnectedFormTitle } from './form-title/connected-form-title.component';
import { ConnectedFormDistribution } from './form-distribution/connected-form-distribution.component';
import { ConnectedFormSample } from './form-sample/connected-form-sample.component';
import { ConnectedFormSpatial } from './form-spatial/connected-form-spatial.component';
import { ConnectedFormProvenance } from './form-provenance/connected-form-provenance.component';
import { ConnectedFormThemes } from './form-theme/connected-form-theme.component';
import { ConnectedFormType } from './form-type/connected-form-type.component';
import { ConnectedFormConcept } from './form-concept/connected-form-concept.component';
import { ConnectedFormAccessRights } from './form-accessRights/connected-form-accessRights.component';
import { ConnectedFormReference } from './form-reference/connected-form-reference.component';
import DatasetPublish from './publish/publish.component';
import { ConnectedFormInformationModel } from './form-informationmodel/connected-form-informationmodel.component';
import { ConnectedFormContactPoint } from './form-contactPoint/connected-form-contactPoint.component';
import { ConnectedFormContents } from './form-contents/connected-form-contents.component';
import {
  titleValues,
  accessRightsValues,
  themesValues,
  typeValues,
  conceptValues,
  spatialValues,
  provenanceValues,
  contentsValues,
  informationModelValues,
  referenceValues,
  contactPointValues,
  distributionValues,
  sampleValues
} from './dataset-registration-page.logic';
import './dataset-registration-page.scss';

export class RegDataset extends React.Component {
  constructor(props) {
    super(props);

    this.props.fetchHelptextsIfNeeded();
    this.props.fetchProvenanceIfNeeded();
    this.props.fetchFrequencyIfNeeded();
    this.props.fetchThemesIfNeeded();
    this.props.fetchReferenceTypesIfNeeded();
    this.props.fetchOpenLicensesIfNeeded();
  }

  componentWillMount() {
    const { match } = this.props;
    const catalogId = _.get(match, ['params', 'catalogId']);
    this.props.fetchDatasetsIfNeeded(catalogId);
    this.props.fetchReferenceDatasetsIfNeeded(
      `/catalogs/${catalogId}/datasets`
    );
  }

  render() {
    const {
      helptextItems,
      themesItems,
      provenanceItems,
      frequencyItems,
      title,
      accessRights,
      formThemes,
      type,
      concept,
      spatial,
      formProvenance,
      contents,
      informationModel,
      reference,
      contactPoint,
      distribution,
      sample,
      registrationStatus,
      lastSaved,
      datasetItem,
      referenceTypesItems,
      referenceDatasetsItems,
      openLicenseItems
    } = this.props;
    const datasetURL = window.location.pathname;
    const catalogDatasetsURL = datasetURL.substring(
      0,
      datasetURL.lastIndexOf('/')
    );
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
            helptextItems &&
            title &&
            themesItems &&
            provenanceItems &&
            frequencyItems &&
            referenceTypesItems &&
            referenceDatasetsItems &&
            openLicenseItems && (
              <div className="col-md-8">
                <FormTemplateWithState
                  title={localization.datasets.formTemplates.title}
                  required
                  values={titleValues(title.values)}
                  syncErrors={title.syncErrors}
                >
                  <ConnectedFormTitle
                    datasetItem={datasetItem}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.accessRight}
                  required
                  values={accessRightsValues(accessRights.values)}
                  syncErrors={accessRights.syncErrors}
                >
                  <ConnectedFormAccessRights
                    datasetItem={datasetItem}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.theme}
                  required
                  values={themesValues(formThemes.values)}
                  syncErrors={formThemes.syncErrors}
                >
                  <ConnectedFormThemes
                    datasetItem={datasetItem}
                    themesItems={themesItems}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.type}
                  values={typeValues(type.values)}
                  syncErrors={type.syncErrors}
                >
                  <ConnectedFormType
                    datasetItem={datasetItem}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.concept}
                  values={conceptValues(concept.values)}
                  syncErrors={concept.syncErrors}
                >
                  <ConnectedFormConcept
                    datasetItem={datasetItem}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.spatial}
                  values={spatialValues(spatial.values)}
                  syncErrors={spatial.syncErrors}
                >
                  <ConnectedFormSpatial
                    datasetItem={datasetItem}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.provenance}
                  values={provenanceValues(formProvenance.values)}
                  syncErrors={formProvenance.syncErrors}
                >
                  <ConnectedFormProvenance
                    datasetItem={datasetItem}
                    provenanceItems={provenanceItems}
                    frequencyItems={frequencyItems}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.content}
                  values={contentsValues(contents.values)}
                  syncErrors={contents.syncErrors}
                >
                  <ConnectedFormContents
                    datasetItem={datasetItem}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.informationModel}
                  values={informationModelValues(informationModel.values)}
                  syncErrors={informationModel.syncErrors}
                >
                  <ConnectedFormInformationModel
                    datasetItem={datasetItem}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.reference}
                  values={referenceValues(reference.values)}
                >
                  <ConnectedFormReference
                    datasetItem={datasetItem}
                    referenceTypesItems={referenceTypesItems}
                    referenceDatasetsItems={referenceDatasetsItems}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.contactInformation}
                  values={contactPointValues(contactPoint.values)}
                  syncErrors={contactPoint.syncErrors}
                >
                  <ConnectedFormContactPoint
                    datasetItem={datasetItem}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.distribution}
                  backgroundBlue
                  values={distributionValues(distribution.values)}
                  syncErrors={
                    distribution.syncErrors &&
                    distribution.syncErrors.distribution &&
                    JSON.stringify(distribution.syncErrors.distribution) !==
                      '{}'
                      ? distribution.syncErrors.distribution
                      : null
                  }
                >
                  <ConnectedFormDistribution
                    datasetItem={datasetItem}
                    openLicenseItems={openLicenseItems}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.sample}
                  backgroundBlue
                  values={sampleValues(sample.values)}
                  syncErrors={
                    sample.syncErrors &&
                    sample.syncErrors.sample &&
                    sample.syncErrors.sample.length > 0
                      ? sample.syncErrors.sample
                      : null
                  }
                >
                  <ConnectedFormSample
                    datasetItem={datasetItem}
                    openLicenseItems={openLicenseItems}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <DatasetPublish
                  dispatch={this.props.dispatch}
                  registrationStatus={
                    registrationStatus && registrationStatus.length > 0
                      ? registrationStatus
                      : datasetItem.registrationStatus
                  }
                  lastSaved={lastSaved || datasetItem._lastModified}
                  syncErrors={
                    !!(
                      (title && title.syncErrors) ||
                      (accessRights && accessRights.syncErrors) ||
                      (formThemes && formThemes.syncErrors) ||
                      (type && type.syncErrors) ||
                      (concept && concept.syncErrors) ||
                      (spatial && spatial.syncErrors) ||
                      (formProvenance && formProvenance.syncErrors) ||
                      (contents && contents.syncErrors) ||
                      (informationModel && informationModel.syncErrors) ||
                      (contactPoint && contactPoint.syncErrors) ||
                      (sample &&
                        sample.syncErrors &&
                        sample.syncErrors.sample &&
                        sample.syncErrors.sample.length > 0)
                    )
                  }
                  distributionErrors={
                    distribution && distribution.syncErrors
                      ? distribution.syncErrors
                      : null
                  }
                />
              </div>
            )}
          <div className="col-md-2" />
        </div>
      </div>
    );
  }
}

RegDataset.defaultProps = {
  match: null,
  helptextItems: null,
  themesItems: null,
  provenanceItems: null,
  frequencyItems: null,
  title: null,
  accessRights: null,
  formThemes: null,
  type: null,
  concept: null,
  spatial: null,
  formProvenance: null,
  contents: null,
  informationModel: null,
  reference: null,
  contactPoint: null,
  distribution: null,
  sample: null,
  registrationStatus: null,
  lastSaved: null,
  datasetItem: null,
  referenceTypesItems: null,
  referenceDatasetsItems: null,
  openLicenseItems: null,
  fetchDatasetsIfNeeded: _.noop(),
  fetchProvenanceIfNeeded: _.noop(),
  fetchFrequencyIfNeeded: _.noop(),
  fetchThemesIfNeeded: _.noop(),
  fetchReferenceTypesIfNeeded: _.noop(),
  fetchReferenceDatasetsIfNeeded: _.noop(),
  fetchOpenLicensesIfNeeded: _.noop(),
  fetchHelptextsIfNeeded: _.noop()
};

RegDataset.propTypes = {
  match: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  helptextItems: PropTypes.object,
  themesItems: PropTypes.array,
  provenanceItems: PropTypes.object,
  frequencyItems: PropTypes.array,
  title: PropTypes.object,
  accessRights: PropTypes.object,
  formThemes: PropTypes.object,
  type: PropTypes.object,
  concept: PropTypes.object,
  spatial: PropTypes.object,
  formProvenance: PropTypes.object,
  contents: PropTypes.object,
  informationModel: PropTypes.object,
  reference: PropTypes.object,
  contactPoint: PropTypes.object,
  distribution: PropTypes.object,
  sample: PropTypes.object,
  registrationStatus: PropTypes.string,
  lastSaved: PropTypes.string,
  datasetItem: PropTypes.object,
  referenceTypesItems: PropTypes.array,
  referenceDatasetsItems: PropTypes.array,
  openLicenseItems: PropTypes.array,
  fetchDatasetsIfNeeded: PropTypes.func,
  fetchProvenanceIfNeeded: PropTypes.func,
  fetchFrequencyIfNeeded: PropTypes.func,
  fetchThemesIfNeeded: PropTypes.func,
  fetchReferenceTypesIfNeeded: PropTypes.func,
  fetchReferenceDatasetsIfNeeded: PropTypes.func,
  fetchOpenLicensesIfNeeded: PropTypes.func,
  fetchHelptextsIfNeeded: PropTypes.func
};
