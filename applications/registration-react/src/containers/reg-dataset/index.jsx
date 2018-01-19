import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TitleForm from '../../components/dataset-form-title';
import FormCode from '../../components/dataset-redux-form-title';
import { fetchDatasetIfNeeded, fetchHelptextsIfNeeded } from '../../actions/index';
import FormTemplate from '../../components/reg-form-template';
import FormTitle from '../../components/reg-form-title';
import FormDistribution from '../../components/reg-form-distribution';
import './index.scss';


class RegDataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.props.dispatch(fetchDatasetIfNeeded());
    this.props.dispatch(fetchHelptextsIfNeeded());
    this.handleSave = this.handleSave.bind(this);
  }

  fetchDataset() {
    this.props.dispatch(fetchDatasetIfNeeded());
  }

  fetchHelptexts() {
    this.props.dispatch(fetchHelptextsIfNeeded());
  }

  componentWillMount() {
  }

  handleSave(e, setTouched, values, errors) {

  }

  render() {
    const { helptextItems } = this.props;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            brødsmule-meny kommer her
          </div>
        </div>
        <div className="row mt-2 mt-md-5 mb-2 mb-md-5">
        <div className="col-md-2">
        </div>
        <div className="col-md-8">
          <FormTemplate
            title="Distribusjoner"
          >
            {helptextItems &&
            <FormDistribution
              helptextItems={helptextItems}
            />
            }
          </FormTemplate>

          <FormTemplate
            title="Tittel og beskrivelse"
          >
            {helptextItems &&
            <FormTitle
              helptextItems={helptextItems}
            />
            }
          </FormTemplate>

        </div>
        <div className="col-md-2">
        </div>
        </div>
      </div>
    );
  }
}

RegDataset.defaultProps = {

};

RegDataset.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps({ dataset, helptexts }, ownProps) {
  const { result, isFetching } = dataset || {
    result: false,
    isFetching: false
  }

  const { helptextItems } = helptexts || {
    helptextItems: false,
    isFetchingH: false
  }

  return {
    result,
    isFetching,
    helptextItems
  };
}

export default connect(mapStateToProps)(RegDataset);
