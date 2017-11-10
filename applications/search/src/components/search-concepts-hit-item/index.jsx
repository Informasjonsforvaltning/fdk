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
          <strong>
            {
              (publisher && publisher.name)
                ? publisher.name.charAt(0) + publisher.name.substring(1).toLowerCase()
                : ''
            }
          </strong>
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
    const { source } = this.state;

    // Read fields from search-hit, use correct language field if specified.
    const hitId = encodeURIComponent(source.id);
    const hitElementId = `concepts-hit-${hitId}`;
    let { title, description } = source;
    if (title) {
      title = getTranslateText(source.title, this.props.selectedLanguageCode);
    }
    if (description) {
      description = getTranslateText(source.description, this.props.selectedLanguageCode);
    }

    if (description && description.length > 220) {
      description = `${description.substr(0, 220)}...`;
    }

    return (
      <div
        id={hitElementId}
        className="fdk-a-search-hit"
        title={`${localization.result.dataset}: ${title}`}
      >
        <div className="fdk-container fdk-container-search-hit">
          <h2 className="inline-block mr-2">{title}</h2>
          {this._renderPublisher()}
          <div className="mt-3">
            {this._renderThemes()}
          </div>
          <p
            className="fdk-p-search-hit"
          >
            {description}
          </p>
          <div>
            <span className="fa-stack fdk-fa-left fdk-fa-circle">
              <i className="fa fa-book fa-stack-1x fdk-color0" />
            </span>
            <a
              href="https://lovdata.no"
            >
              Skatteloven $5 (https://lovdata.no)
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          </div>
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
