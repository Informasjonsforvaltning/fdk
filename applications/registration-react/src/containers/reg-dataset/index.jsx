import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';

import localization from '../../utils/localization';
import {
  fetchUserIfNeeded,
  fetchDatasetIfNeeded,
  fetchHelptextsIfNeeded,
  fetchProvenanceIfNeeded,
  fetchFrequencyIfNeeded,
  fetchThemesIfNeeded,
  fetchReferenceTypesIfNeeded,
  fetchReferenceDatasetsIfNeeded
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
import TimeoutModal from '../../components/app-timeout-modal';
import FormInformationModel from '../../components/reg-form-schema-informationmodel';
import FormContactPoint from '../../components/reg-form-schema-contactPoint';
import FormContents from '../../components/reg-form-schema-contents';
import './index.scss';


class RegDataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInactiveWarning: false
    }
    const datasetURL = window.location.pathname;
    const catalogDatasetsURL = datasetURL.substring(0, datasetURL.lastIndexOf('/'));
    this.props.dispatch(fetchDatasetIfNeeded(datasetURL));
    this.props.dispatch(fetchReferenceDatasetsIfNeeded(catalogDatasetsURL));
    this.props.dispatch(fetchHelptextsIfNeeded());
    this.props.dispatch(fetchProvenanceIfNeeded());
    this.props.dispatch(fetchFrequencyIfNeeded());
    this.props.dispatch(fetchThemesIfNeeded());
    this.props.dispatch(fetchReferenceTypesIfNeeded());
    this.onIdle = this.onIdle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.refreshSession = this.refreshSession.bind(this);
  }

  onIdle() {
    this.setState({
      showInactiveWarning: true
    })
  }

  fetchHelptexts() {
    this.props.dispatch(fetchHelptextsIfNeeded());
  }

  _titleValues() {
    const { values } = this.props.title;
    if (values) {
      const retVal = `${values.title.nb} ${values.description.nb} ${values.objective.nb}`
      if (retVal.trim().length > 0) {
        return retVal;
      }
    } return null;
  }

  fetchDataset() {
    this.props.dispatch(fetchDatasetIfNeeded());
  }

  toggle() {
    this.setState({
      showInactiveWarning: false
    });
    window.location.href = `${window.location.origin  }/logout#timed-out`;
  }

  refreshSession() {
    this.setState({
      showInactiveWarning: false
    });
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
      contactPoint,
      distribution,
      sample,
      registrationStatus,
      lastSaved,
      result,
      referenceTypesItems,
      referenceDatasetsItems
    } = this.props;

    return (
      <IdleTimer
        element={document}
        idleAction={this.onIdle}
        timeout={27.5 * 60 * 1000} // gir idle warning etter 27,5 minutter
        format="DD.MM.YYYY HH:MM:ss.SSS"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12" />
          </div>
          <div className="row mt-2 mt-md-5 mb-2 mb-md-5">
            <div className="col-md-2" />
            {!isFetching && helptextItems && title && referenceTypesItems && referenceDatasetsItems &&
            <div className="col-md-8">

              <FormTemplate
                title="Tittel og beskrivelse"
                values={this._titleValues()}
                syncErrors={title.syncErrors}
              >
                <FormTitle
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Tilgangsnivå"
                syncErrors={accessRights.syncErrors}
              >
                <FormAccessRights
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Tema"
                syncErrors={formThemes.syncErrors}
              >
                <FormTheme
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Type"
                syncErrors={type.syncErrors}
              >
                <FormType
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Begrep og søkeord"
                syncErrors={concept.syncErrors}
              >
                <FormConcept
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Geografi, tid og språk"
                syncErrors={spatial.syncErrors}
              >
                <FormSpatial
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Opphav og ferskhet"
                syncErrors={formProvenance.syncErrors}
              >
                <FormProvenance
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Innhold"
                syncErrors={contents.syncErrors}
              >
                <FormContents
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Informasjonsmodell"
                syncErrors={informationModel.syncErrors}
              >
                <FormInformationModel
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Relasjoner"
              >
                <FormReference
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Kontaktinformasjon"
                syncErrors={contactPoint.syncErrors}
              >
                <FormContactPoint
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Distribusjoner"
                syncErrors={distribution.syncErrors}
              >
                <FormDistribution
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Eksempeldata"
                syncErrors={sample.syncErrors}
              >
                <FormSample
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <DatasetPublish
                dispatch={this.props.dispatch}
                registrationStatus={(registrationStatus && registrationStatus.length > 0) ? registrationStatus : result.registrationStatus}
                lastSaved={lastSaved || result._lastModified}
                syncErrors={!!((concept && concept.syncErrors) || (title && title.syncErrors))}
              />
            </div>
            }
            <div className="col-md-2" />
          </div>
        </div>
        <TimeoutModal
          modal={this.state.showInactiveWarning}
          toggle={this.toggle}
          refreshSession={this.refreshSession}
          title={localization.inactiveSessionWarning.title}
          ingress={localization.inactiveSessionWarning.loggingOut}
          body={localization.inactiveSessionWarning.stayLoggedIn}
          buttonConfirm={localization.inactiveSessionWarning.buttonStayLoggedIn}
          buttonLogout={localization.inactiveSessionWarning.buttonLogOut}
        />
      </IdleTimer>
    );
  }
}

RegDataset.defaultProps = {

};

RegDataset.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps({ app, dataset, helptexts, provenance, frequency, themes, referenceTypes, referenceDatasets, form }) {
  const { result, isFetching } = dataset || {
    result: null,
    isFetching: false
  }

  const { helptextItems } = helptexts || {
    helptextItems: null
  }

  const { provenanceItems } = provenance || {
    provenanceItems: null
  }

  const { frequencyItems } = frequency || {
    frequencyItems: null
  }

  const { themesItems } = themes || {
    themesItems: null
  }

  const { referenceTypesItems } = referenceTypes || {
    referenceTypesItems: null
  }

  const { referenceDatasetsItems } = referenceDatasets || {
    referenceDatasetsItems: null
  }


  const title = form.title || {
    title: null
  }

  const accessRights = form.accessRights || {
    accessRights: null
  }

  const formThemes = form.themes || {
    formThemes: null
  }

  const type = form.type || {
    type: null
  }

  const concept = form.concept || {
    concept: null
  }

  const spatial = form.spatial || {
    spatial: null
  }

  const formProvenance = form.provenance || {
    formProvenance: null
  }

  const contents = form.contents || {
    contents: null
  }

  const informationModel = form.informationModel || {
    informationModel: null
  }

  const contactPoint = form.contactPoint || {
    contactPoint: null
  }

  const distribution = form.distribution || {
    distribution: null
  }

  const sample = form.sample || {
    sample: null
  }

  const { registrationStatus, lastSaved } = app || {
    registrationStatus: null,
    lastSaved: null
  }

  return {
    result,
    isFetching,
    helptextItems,
    provenanceItems,
    frequencyItems,
    themesItems,
    referenceTypesItems,
    referenceDatasetsItems,
    title,
    accessRights,
    formThemes,
    type,
    concept,
    spatial,
    formProvenance,
    contents,
    informationModel,
    contactPoint,
    distribution,
    sample,
    registrationStatus,
    lastSaved
  };
}

export default connect(mapStateToProps)(RegDataset);
