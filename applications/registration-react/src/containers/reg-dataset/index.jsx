import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  fetchDatasetIfNeeded,
  fetchHelptextsIfNeeded,
  fetchProvenanceIfNeeded,
  fetchFrequencyIfNeeded,
  fetchThemesIfNeeded
} from '../../actions/index';
import FormTemplate from '../../components/reg-form-template';
import FormTitle from '../../components/reg-form-schema-title';
import FormDistribution from '../../components/reg-form-schema-distribution';
import FormSpatial from '../../components/reg-form-schema-spatial';
import FormProvenance from '../../components/reg-form-schema-provenance';
import FormTheme from '../../components/reg-form-schema-theme';
import FormType from '../../components/reg-form-schema-type';
import FormConcept from '../../components/reg-form-schema-concept';
import DatasetPublish from '../../components/reg-form-dataset-publish';
import './index.scss';


class RegDataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    const datasetURL = window.location.pathname.substr(6);
    this.props.dispatch(fetchDatasetIfNeeded(datasetURL));
    this.props.dispatch(fetchHelptextsIfNeeded());
    this.props.dispatch(fetchProvenanceIfNeeded());
    this.props.dispatch(fetchFrequencyIfNeeded());
    this.props.dispatch(fetchThemesIfNeeded());
    // this._titleValues = this._titleValues.bind(this);
  }

  fetchDataset() {
    this.props.dispatch(fetchDatasetIfNeeded());
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

  render() {
    const { helptextItems, isFetching, title, registrationStatus, lastSaved, result, concept  } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12" />
        </div>
        <div className="row mt-2 mt-md-5 mb-2 mb-md-5">
          <div className="col-md-2" />
          {!isFetching && helptextItems && title &&
            <div className="col-md-8">

              <FormTemplate
                title="Begrep og søkeord"
              >
                <FormConcept
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Tittel og beskrivelse"
                values={this._titleValues()}
              >
                <FormTitle
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
                title="Distribusjoner"
              >
                <FormDistribution
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <DatasetPublish
                dispatch={this.props.dispatch}
                registrationStatus={(registrationStatus && registrationStatus.length > 0) ? registrationStatus : result.registrationStatus}
                lastSaved={lastSaved ? lastSaved : result._lastModified}
                syncErrors={(concept && concept.syncErrors) || (title && title.syncErrors) ? true : false}
              />
            </div>
          }
          <div className="col-md-2" />
        </div>
      </div>
    );
  }
}

RegDataset.defaultProps = {

};

RegDataset.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps({ app, dataset, helptexts, provenance, frequency, themes, form }) {
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
    title,
    registrationStatus,
    lastSaved,
    concept
  };
}

export default connect(mapStateToProps)(RegDataset);
