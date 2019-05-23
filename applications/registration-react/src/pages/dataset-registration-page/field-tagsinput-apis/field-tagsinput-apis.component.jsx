import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactTags from 'react-tag-autocomplete';

import { getTranslateText } from '../../../lib/translateText';
import { getAPIByTitlePrefix } from '../../../api/apis';
import localization from '../../../lib/localization';

const TYPE_API = 'API';

const addTagToInput = (updates, props) => {
  const { input } = props;
  let inputValues = input.value;
  if (!inputValues) {
    inputValues = [];
  }
  inputValues.push({
    format: [],
    type: TYPE_API,
    accessService: {
      description: {
        [localization.getLanguage()]: _.get(updates, ['name'])
      },
      endpointDescription: [
        {
          uri: _.get(updates, ['id'])
        }
      ]
    }
  });
  input.onChange(inputValues);
};

const removeTagFromInput = (index, props) => {
  const { input } = props;
  const distributions = input.value;

  // find distribution-apis among all distributions
  const distributionApis = _.reject(distributions, { accessService: null });
  // save all distributsions except the one deleted by index
  input.onChange(_.reject(distributions, distributionApis[index]));
};

export class InputTagsAPIsField extends React.Component {
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
    const { input } = this.props;
    const datasetReferences = [];
    _.get(input, 'value', []).forEach(item => {
      if (_.get(item, 'accessService')) {
        datasetReferences.push({
          id: item.id,
          name: getTranslateText(_.get(item, ['accessService', 'description']))
        });
      }
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
    const suggestionItems = [];

    getAPIByTitlePrefix(value, _.get(this.props, 'orgPath'), returnFields)
      .then(responseData => {
        _.get(responseData, 'hits', []).forEach(item => {
          suggestionItems.push({
            id: _.get(item, 'id'),
            name: _.get(item, 'title')
          });
        });
        this.setState({
          suggestions: suggestionItems
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

InputTagsAPIsField.defaultProps = {
  input: null
};

InputTagsAPIsField.propTypes = {
  input: PropTypes.object
};
