import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TitleForm from '../../components/dataset-form-title';
import FormCode from '../../components/dataset-redux-form-title';
import { fetchDatasetIfNeeded } from '../../actions/index';


class Dataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: {
        id: "e679b150-e69d-444c-bf7f-874d6999c62d",
        uri: "http://brreg.no/catalogs/910244132/datasets/e679b150-e69d-444c-bf7f-874d6999c62d",
        title: {
          nb: "in"
        },
        description: null,
        objective: null,
        publisher: {
          uri: "http://data.brreg.no/enhetsregisteret/enhet/910244132",
          id: "910244132",
          name: "RAMSUND OG ROGNAN REVISJON"
        },
        accessRights: {
          uri: "http://publications.europa.eu/resource/authority/access-right/RESTRICTED"
        },
        catalogId: "910244132",
        _lastModified: "2018-01-12T10:58:07.524+0000",
        registrationStatus: "DRAFT",
        keyword: [{
          nb: "Søkeord 3"
        }],
        subject: null,
        theme: null,
        landingPage: null,
        identifier: null,
        contactPoint: null,
        conformsTo: null,
        distribution: null,
        sample: null,
        language: null,
        temporal: null,
        legalBasisForProcessing: null,
        legalBasisForAccess: null,
        informationModel: null,
        references: null,
        issued: null,
        modified: null,
        type: null,
        accrualPeriodicity: null,
        provenance: null,
        hasCurrentnessAnnotation: null,
        spatial: [{
          uri: "hurum",
          prefLabel: null
        }],
        legalBasisForRestriction: [{
          uri: null,
          prefLabel: {
            nb: "testerPrefLabel"
          }
        }]
      }
    }
    this.props.dispatch(fetchDatasetIfNeeded());
    this.handleSave = this.handleSave.bind(this);

  }

  fetchDataset() {
    this.props.dispatch(fetchDatasetIfNeeded());
  }

  componentWillMount() {

  }

  handleSave(e, setTouched, values, errors) {
    setTouched({[e.target.name]: true});
    const saveValue = e.target.value
    switch (e.target.name) {
      case "title":
          this.setState({
            ...this.state,
            dataset: {
              title: {
                nb: `${e.target.value}`
              }
            }
        });
    }

    const api = {
      Authorization: "Basic " + null
    }
    const dataset = this.state.dataset;
    axios.put(
      '/catalogs/910244132/datasets/e679b150-e69d-444c-bf7f-874d6999c62d/', dataset, {headers: api}
    )
      .then((response) => {
        console.log("saved!");
      })
      .catch((error) => {
        console.log('feiler');
      })
    ;
  }

  render() {
    const {isFetching, result } = this.props;
    return (
      <div>
        <div>Registrering redux-form</div>
        {!isFetching && result &&
          <div>
            {JSON.stringify(result)}
          </div>
        }
        <FormCode/>
        <div>Registrering Formik</div>
        <TitleForm
          title={this.state.dataset.title.nb} onSave={this.handleSave}
        />
      </div>
    );
  }
}

Dataset.defaultProps = {

};

Dataset.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps({ dataset }, ownProps) {



  /*
  const {edit} = ownProps.location.query || {
    edit: "false"
  };

  const { result, isFetching } = api || {
    result: false,
    isFetching: false
  };

  const { menuItems } = menu || {
    menuItems: false
  };

  return {
    result,
    isFetching,
    name: ownProps.params,
    menuItems,
    edit
  };
  */

  const { result, isFetching } = dataset || {
    result: false,
    isFetching: false
  }

  //console.log(JSON.stringify(result));

  return {
    result,
    isFetching
  };
}

export default connect(mapStateToProps)(Dataset);
