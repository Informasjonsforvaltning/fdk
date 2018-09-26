import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import localization from '../../utils/localization';
import {
  fetchUserIfNeeded,
  fetchDatasetIfNeeded,
  fetchHelptextsIfNeeded,
  fetchProvenanceIfNeeded,
  fetchFrequencyIfNeeded,
  fetchThemesIfNeeded,
  fetchReferenceTypesIfNeeded,
  fetchReferenceDatasetsIfNeeded,
  fetchOpenLicensesIfNeeded
} from '../../actions/index';
import FormTemplate from '../../components/reg-form-template';
import FormTitle from '../../components/reg-form-schema-title';
import FormDistribution from '../../components/reg-form-schema-distribution';
import FormSample from '../../components/reg-form-schema-sample';
import FormSpatial from '../../components/reg-form-schema-spatial';
import FormProvenance from '../../components/reg-form-schema-provenance';
import FormTheme from '../../components/reg-form-schema-theme';
import FormType from '../../components/reg-form-schema-type';
import FormConcept from '../../components/reg-form-schema-concept';
import FormAccessRights from '../../components/reg-form-schema-accessRights';
import FormReference from '../../components/reg-form-schema-reference';
import DatasetPublish from '../../components/reg-form-dataset-publish';
import FormInformationModel from '../../components/reg-form-schema-informationmodel';
import FormContactPoint from '../../components/reg-form-schema-contactPoint';
import FormContents from '../../components/reg-form-schema-contents';
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
} from './logic';
import './index.scss';

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
    const catalogURL = catalogDatasetsURL.substring(
      0,
      catalogDatasetsURL.lastIndexOf('/')
    );
    return (
      <div className="container">
        <div className="row mb-2 mb-md-5">
          <div className="col-md-2">
            <i className="fa fa-arrow-left mr-2" />
            <Link
              className="fdk-text-size-small fdk-color1 font-weight-light"
              to={catalogURL}
            >
              {localization.datasets.backToCatalog}
            </Link>
          </div>
          {!isFetching &&
            helptextItems &&
            title &&
            referenceTypesItems &&
            referenceDatasetsItems &&
            openLicenseItems && (
              <div className="col-md-8">
                <FormTemplate
                  title={localization.datasets.formTemplates.title}
                  required
                  values={titleValues(title.values)}
                  syncErrors={title.syncErrors}
                >
                  <FormTitle helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
                  title={localization.datasets.formTemplates.accessRight}
                  required
                  values={accessRightsValues(accessRights.values)}
                  syncErrors={accessRights.syncErrors}
                >
                  <FormAccessRights helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
                  title={localization.datasets.formTemplates.theme}
                  required
                  values={themesValues(formThemes.values)}
                  syncErrors={formThemes.syncErrors}
                >
                  <FormTheme helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
                  title={localization.datasets.formTemplates.type}
                  values={typeValues(type.values)}
                  syncErrors={type.syncErrors}
                >
                  <FormType helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
                  title={localization.datasets.formTemplates.concept}
                  values={conceptValues(concept.values)}
                  syncErrors={concept.syncErrors}
                >
                  <FormConcept helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
                  title={localization.datasets.formTemplates.spatial}
                  values={spatialValues(spatial.values)}
                  syncErrors={spatial.syncErrors}
                >
                  <FormSpatial helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
                  title={localization.datasets.formTemplates.provenance}
                  values={provenanceValues(formProvenance.values)}
                  syncErrors={formProvenance.syncErrors}
                >
                  <FormProvenance helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
                  title={localization.datasets.formTemplates.content}
                  values={contentsValues(contents.values)}
                  syncErrors={contents.syncErrors}
                >
                  <FormContents helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
                  title={localization.datasets.formTemplates.informationModel}
                  values={informationModelValues(informationModel.values)}
                  syncErrors={informationModel.syncErrors}
                >
                  <FormInformationModel helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
                  title={localization.datasets.formTemplates.reference}
                  values={referenceValues(reference.values)}
                >
                  <FormReference helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
                  title={localization.datasets.formTemplates.contactInformation}
                  values={contactPointValues(contactPoint.values)}
                  syncErrors={contactPoint.syncErrors}
                >
                  <FormContactPoint helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
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
                  <FormDistribution helptextItems={helptextItems} />
                </FormTemplate>

                <FormTemplate
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
                  <FormSample helptextItems={helptextItems} />
                </FormTemplate>

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
