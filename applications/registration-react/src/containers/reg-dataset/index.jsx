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
import FormInformationModel from '../../components/reg-form-dataset-informationmodel';
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
      return (
        `${values.title.nb} ${values.description.nb}`
      );
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
      registrationStatus,
      lastSaved,
      result,
      concept,
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
              >
                <FormTitle
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Tilgangsnivå"
              >
                <FormAccessRights
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Tema"
              >
                <FormTheme
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Type"
              >
                <FormType
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Begrep og søkeord"
              >
                <FormConcept
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Geografi, tid og språk"
              >
                <FormSpatial
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Opphav og ferskhet"
              >
                <FormProvenance
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Informasjonsmodell"
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
                title="Distribusjoner"
              >
                <FormDistribution
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Eksempeldata"
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

  const { registrationStatus, lastSaved } = app || {
    registrationStatus: null,
    lastSaved: null
  }

  const { concept } = form || {
    concept: null
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
    registrationStatus,
    lastSaved,
    concept
  };
}

export default connect(mapStateToProps)(RegDataset);
