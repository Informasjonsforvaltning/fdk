import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactTags from 'react-tag-autocomplete';
import getTranslateText from '../../../utils/translateText';
import { getDatasetByTitlePrefix } from '../../../api/get-dataset-by-title-prefix';
import './field-tagsinput-datasets.scss';

const addTagToInput = (updates, props) => {
  const { input } = props;
  let inputValues = input.value;
  if (!inputValues) {
    inputValues = [];
  }
  inputValues.push(_.get(updates, ['id']));
  input.onChange(inputValues);
};

const removeTagFromInput = (index, props) => {
  const { input } = props;
  const inputValues = input.value;

  inputValues.splice(index, 1);
  input.onChange(inputValues);
};

export class InputTagsDatasetsField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      suggestions: []
    };
    this.loadSuggestions = this.loadSuggestions.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    const { input, referencedDatasets } = this.props;
    const datasetReferences = [];
    _.get(input, 'value').forEach(item => {
      datasetReferences.push({
        id: item,
        name: getTranslateText(
          _.get(_.find(referencedDatasets, ['uri', item]), 'title')
        )
      });
    });
    this.setState({
      tags: datasetReferences
    });
  }

  handleDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
    removeTagFromInput(i, this.props);
  }

  handleAddition(tag) {
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
    addTagToInput(tag, this.props);
  }

  handleInputChange(input) {
    this.loadSuggestions(input);
  }

  loadSuggestions(value) {
    const returnFields = 'title,uri';
    const datasets = [];

    getDatasetByTitlePrefix(
      value,
      _.get(this.props, 'orgPath'),
      false,
      returnFields
    )
      .then(responseData => {
        _.get(responseData, ['hits', 'hits'], []).forEach(item => {
          datasets.push({
            id: _.get(item, ['_source', 'uri']),
            name: _.get(item, ['_source', 'title', 'nb'])
          });
        });
        this.setState({
          suggestions: datasets
        });
      })
      .catch(error => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('error', error); // eslint-disable-line no-console
        }
      });
  }

  render() {
    return (
      <div className="pl-2">
        <div className="d-flex align-items-center">
          <ReactTags
            autofocus={false}
            placeholder=""
            tags={this.state.tags}
            suggestions={this.state.suggestions}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            handleInputChange={this.handleInputChange}
          />
        </div>
      </div>
    );
  }
}

InputTagsDatasetsField.defaultProps = {
  input: null,
  referencedDatasets: null
};

InputTagsDatasetsField.propTypes = {
  input: PropTypes.object,
  referencedDatasets: PropTypes.array
};
