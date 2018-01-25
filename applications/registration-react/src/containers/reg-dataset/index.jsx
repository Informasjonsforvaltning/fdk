import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchDatasetIfNeeded, fetchHelptextsIfNeeded } from '../../actions/index';
import FormTemplate from '../../components/reg-form-template';
import FormTitle from '../../components/reg-form-schema-title';
import FormDistribution from '../../components/reg-form-schema-distribution';
import FormSpatial from '../../components/reg-form-schema-spatial';
import './index.scss';


class RegDataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    const datasetURL = window.location.pathname.substr(6);
    this.props.dispatch(fetchDatasetIfNeeded(datasetURL));
    this.props.dispatch(fetchHelptextsIfNeeded());
  }

  fetchDataset() {
    this.props.dispatch(fetchDatasetIfNeeded());
  }

  fetchHelptexts() {
    this.props.dispatch(fetchHelptextsIfNeeded());
  }

  render() {
    const { result, helptextItems, isFetching } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
              brødsmule-meny kommer her {isFetching ? 'true' : 'false'}
          </div>
        </div>
        <div className="row mt-2 mt-md-5 mb-2 mb-md-5">
          <div className="col-md-2" />
          {!isFetching && helptextItems &&
            <div className="col-md-8">

              <FormTemplate
                title="Geografi, tid og språk"
              >
                <FormSpatial
                  helptextItems={helptextItems}
                />
              </FormTemplate>

              <FormTemplate
                title="Tittel og beskrivelse"
              >
                <FormTitle
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
  // children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps({ dataset, helptexts }, ownProps) {
  const { result, isFetching } = dataset || {
    result: null,
    isFetching: false
  }

  const { helptextItems } = helptexts || {
    helptextItems: null
  }

  return {
    result,
    isFetching,
    helptextItems
  };
}

export default connect(mapStateToProps)(RegDataset);
