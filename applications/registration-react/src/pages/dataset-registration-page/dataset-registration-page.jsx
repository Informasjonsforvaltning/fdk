import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import localization from '../../utils/localization';
import {
  fetchUserIfNeeded,
  fetchDatasetIfNeeded,
  fetchProvenanceIfNeeded,
  fetchFrequencyIfNeeded,
  fetchThemesIfNeeded,
  fetchReferenceTypesIfNeeded,
  fetchReferenceDatasetsIfNeeded,
  fetchOpenLicensesIfNeeded
} from '../../actions/index';
import { fetchHelptextsIfNeeded } from '../../redux/modules/helptexts';
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
    const datasetURL = window.location.pathname;
    const catalogDatasetsURL = datasetURL.substring(
      0,
      datasetURL.lastIndexOf('/')
    );
    this.props.dispatch(fetchDatasetIfNeeded(datasetURL));
    this.props.dispatch(fetchReferenceDatasetsIfNeeded(catalogDatasetsURL));
    this.props.dispatch(fetchHelptextsIfNeeded());
    this.props.dispatch(fetchProvenanceIfNeeded());
    this.props.dispatch(fetchFrequencyIfNeeded());
    this.props.dispatch(fetchThemesIfNeeded());
    this.props.dispatch(fetchReferenceTypesIfNeeded());
    this.props.dispatch(fetchOpenLicensesIfNeeded());
    this.refreshSession = this.refreshSession.bind(this);
  }

  fetchHelptexts() {
    this.props.dispatch(fetchHelptextsIfNeeded());
  }

  fetchDataset() {
    this.props.dispatch(fetchDatasetIfNeeded());
  }

  refreshSession() {
    this.props.dispatch(fetchUserIfNeeded());
  }

  render() {
    const {
      helptextItems,
      themesItems,
      provenanceItems,
      frequencyItems,
      isFetching,
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
      result,
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
          {!isFetching &&
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
                    datasetItem={result}
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
                    datasetItem={result}
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
                    datasetItem={result}
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
                    datasetItem={result}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.concept}
                  values={conceptValues(concept.values)}
                  syncErrors={concept.syncErrors}
                >
                  <ConnectedFormConcept
                    datasetItem={result}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.spatial}
                  values={spatialValues(spatial.values)}
                  syncErrors={spatial.syncErrors}
                >
                  <ConnectedFormSpatial
                    datasetItem={result}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.provenance}
                  values={provenanceValues(formProvenance.values)}
                  syncErrors={formProvenance.syncErrors}
                >
                  <ConnectedFormProvenance
                    datasetItem={result}
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
                    datasetItem={result}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.informationModel}
                  values={informationModelValues(informationModel.values)}
                  syncErrors={informationModel.syncErrors}
                >
                  <ConnectedFormInformationModel
                    datasetItem={result}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <FormTemplateWithState
                  title={localization.datasets.formTemplates.reference}
                  values={referenceValues(reference.values)}
                >
                  <ConnectedFormReference
                    datasetItem={result}
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
                    datasetItem={result}
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
                    datasetItem={result}
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
                    datasetItem={result}
                    openLicenseItems={openLicenseItems}
                    helptextItems={helptextItems}
                  />
                </FormTemplateWithState>

                <DatasetPublish
                  dispatch={this.props.dispatch}
                  registrationStatus={
                    registrationStatus && registrationStatus.length > 0
                      ? registrationStatus
                      : result.registrationStatus
                  }
                  lastSaved={lastSaved || result._lastModified}
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
  helptextItems: null,
  themesItems: null,
  provenanceItems: null,
  frequencyItems: null,
  isFetching: false,
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
  result: null,
  referenceTypesItems: null,
  referenceDatasetsItems: null,
  openLicenseItems: null
};

RegDataset.propTypes = {
  dispatch: PropTypes.func.isRequired,
  helptextItems: PropTypes.object,
  themesItems: PropTypes.array,
  provenanceItems: PropTypes.object,
  frequencyItems: PropTypes.array,
  isFetching: PropTypes.bool,
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
  result: PropTypes.object,
  referenceTypesItems: PropTypes.array,
  referenceDatasetsItems: PropTypes.array,
  openLicenseItems: PropTypes.array
};

function mapStateToProps({
  app,
  dataset,
  helptexts,
  provenance,
  frequency,
  themes,
  referenceTypes,
  referenceDatasets,
  openlicenses,
  form
}) {
  const { result, isFetching } = dataset || {
    result: null,
    isFetching: false
  };

  const { helptextItems } = helptexts || {
    helptextItems: null
  };

  const { provenanceItems } = provenance || {
    provenanceItems: null
  };

  const { frequencyItems } = frequency || {
    frequencyItems: null
  };

  const { themesItems } = themes || {
    themesItems: null
  };

  const { referenceTypesItems } = referenceTypes || {
    referenceTypesItems: null
  };

  const { referenceDatasetsItems } = referenceDatasets || {
    referenceDatasetsItems: null
  };

  const { openLicenseItems } = openlicenses || {
    openLicenseItems: null
  };

  const title = form && form.title ? form.title : {};

  const accessRights = form && form.accessRights ? form.accessRights : {};

  const formThemes = form && form.themes ? form.themes : {};

  const type = form && form.type ? form.type : {};

  const concept = form && form.concept ? form.concept : {};

  const spatial = form && form.spatial ? form.spatial : {};

  const formProvenance = form && form.provenance ? form.provenance : {};

  const contents = form && form.contents ? form.contents : {};

  const informationModel =
    form && form.informationModel ? form.informationModel : {};

  const reference = form && form.reference ? form.reference : {};

  const contactPoint = form && form.contactPoint ? form.contactPoint : {};

  const distribution = form && form.distribution ? form.distribution : {};

  const sample = form && form.sample ? form.sample : {};

  const { registrationStatus, lastSaved } = app || {
    registrationStatus: null,
    lastSaved: null
  };

  return {
    result,
    isFetching,
    helptextItems,
    provenanceItems,
    frequencyItems,
    themesItems,
    referenceTypesItems,
    referenceDatasetsItems,
    openLicenseItems,
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
    lastSaved
  };
}

export default connect(mapStateToProps)(RegDataset);
