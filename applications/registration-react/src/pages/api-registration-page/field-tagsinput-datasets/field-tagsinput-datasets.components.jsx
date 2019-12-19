import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactTags from 'react-tag-autocomplete';
import { getTranslateText } from '../../../services/translateText';
import { searchDatasets } from '../../../services/api/search-api/datasets';

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

  componentDidMount() {
    const { input, referencedDatasets } = this.props;
    const datasetReferences = [];
    _.get(input, 'value', []).forEach(item => {
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
    const { tags } = this.state;
    const newTags = [...tags];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
    removeTagFromInput(i, this.props);
  }

  handleAddition(tag) {
    const { tags } = this.state;
    this.setState({ tags: [...tags, tag] });
    addTagToInput(tag, this.props);
  }

  handleInputChange(input) {
    this.loadSuggestions(input);
  }

  loadSuggestions(value) {
    const datasets = [];

    searchDatasets({
      title: value,
      returnFields: 'title,uri'
    })
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
    const { tags, suggestions } = this.state;
    return (
      <div className="pl-2">
        <div className="d-flex align-items-center">
          <ReactTags
            autofocus={false}
            placeholder=""
            tags={tags}
            minQueryLength={1}
            suggestions={suggestions}
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
