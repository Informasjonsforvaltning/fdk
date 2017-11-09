import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import DistributionFormat from '../search-dataset-format';
import localization from '../../components/localization';
import { getTranslateText } from '../../utils/translateText';
import './index.scss';

export default class ConceptsHitItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      source: _.extend({}, props.result._source)
    };
  }

  componentDidUpdate() {
    this.state = {
      source: _.extend({}, this.props.result._source)
    };
  }

  _renderFormats(code) {
    let formatNodes;
    const { distribution } = this.state.source;

    const children = (items, code) => items.map((item) => {
      if (item !== null) {
        const formatArray = item.trim().split(',');
        return formatArray.map((item, index) => {
          if (item === null) {
            return null;
          }
          return (
            <DistributionFormat
              key={`dataset-distribution-format${index}`}
              code={code}
              text={item}
            />
          );
        });
      }
      return null;
    });

    if (distribution && _.isArray(Object.keys(distribution))) {
      formatNodes = Object.keys(distribution).map((key) => {
        if (distribution[key].format) {
          return distribution[key].format[0];
        }
        return null;
      });
      if (formatNodes && formatNodes[0] !== null) {
        return (
          <div>
            { children(formatNodes, code) }
          </div>
        );
      }
    }
    return null;
  }

  _renderPublisher() {
    const { publisher } = this.state.source;
    if (publisher && publisher.name) {
      return (
        <span className="inline-block">
          {
            (publisher && publisher.name)
              ? publisher.name.charAt(0) + publisher.name.substring(1).toLowerCase()
              : ''
          }
        </span>
      );
    }
    return null;
  }

  _renderThemes() {
    let themeNodes;
    const { theme } = this.state.source;
    if (theme) {
      themeNodes = theme.map((singleTheme, index) => (
        <span
          key={`dataset-description-theme-${index}`}
          id={`dataset-description-theme-${index}`}
          className="fdk-label"
        >
          {getTranslateText(singleTheme.title, this.props.selectedLanguageCode)}
        </span>
      ));
    }
    return themeNodes;
  }

  _renderSample() {
    const { sample } = this.state.source;
    if (sample) {
      if (sample.length > 0) {
        return (
          <div id="search-hit-sample">
            {localization.search_hit.sample}
          </div>
        );
      }
    }
    return null;
  }

  render() {
    const language = this.props.selectedLanguageCode;
    const { source } = this.state;

    // Read fields from search-hit, use correct language field if specified.
    const hitId = encodeURIComponent(source.id);
    const hitElementId = `concepts-hit-${hitId}`;
    let { title, description, objective } = source;
    if (title) {
      title = source.title[language] || source.title.nb || source.title.nn || source.title.en;
    }
    if (description) {
      description = source.description[language] || source.description.nb || source.description.nn || source.description.en;
    }
    if (objective) {
      objective = objective[language] || objective.nb || objective.nn || objective.en;
    }

    if (description.length > 220) {
      description = `${description.substr(0, 220)}...`;
    } else if (description.length < 150 && objective) {
      const freeLength = 200 - description.length;
      const objectiveLength = objective.length;
      description = `${description} ${objective.substr(0, (200 - freeLength))} ${(objectiveLength > freeLength ? '...' : '')}`;
    }

    return (
      <div
        id={hitElementId}
        className="fdk-a-search-hit"
        title={`${localization.result.dataset}: ${title}`}
      >
        <div className="fdk-container fdk-container-search-hit">
          <h2 className="inline-block">{title}</h2>
          {this._renderPublisher()}
          <div>
            {this._renderThemes()}
          </div>
          <p
            className="fdk-p-search-hit"
          >
            {description}
          </p>
        </div>
      </div>
    );
  }
}

ConceptsHitItem.defaultProps = {
  result: null,
  selectedLanguageCode: 'nb'
};

ConceptsHitItem.propTypes = {
  result: PropTypes.shape({}),
  selectedLanguageCode: PropTypes.string
};
