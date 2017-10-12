import * as React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import cx from 'classnames';
import { Link } from 'react-router';

import DistributionFormat from '../search-dataset-format';
import localization from '../../components/localization';
import './index.scss';

export default class SearchHitItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      result: props.result
    };
  }

  componentDidUpdate() {
    this.state = {
      result: this.props.result
    };
  }

  _renderFormats(source, code) {
    let formatNodes;
    const distribution = source.distribution;
    if (distribution) {
      formatNodes = Object.keys(distribution).map((key) => {
        if (distribution[key].format) {
          const formatArray = distribution[key].format;
          const nodes = formatArray.map((item, index) => (
            <DistributionFormat
              code={code}
              key={`dataset-distribution-format${index}`}
              text={item}
            />
          ));
          return nodes;
        }
        return null;
      });
    }
    return formatNodes;
  }

  _renderFormats2(source, authoriyCode) {
    const distribution = source.distribution;
    let formatNodes;
    if (distribution) {
      formatNodes = Object.keys(distribution).map((key) => {
        if (distribution[key].format) {
          const formatArray = distribution[key].format.trim().split(',');
          const nodes = Object.keys(formatArray).map((key) => {
            if (formatArray[key] !== null) {
              return (
                <DistributionFormat
                  authorityCode={authoriyCode}
                  text={formatArray[key]}
                />
              );
            }
          });
          return nodes;
        }
        return null;
      });
    }
    return formatNodes;
  }

  _renderPublisher(source) {
    const { publisher } = source;
    if (publisher && publisher.name) {
      return (
        <span>
          {localization.search_hit.owned}&nbsp;
          <span id="search-hit-publisher-text">
            { (source.publisher && source.publisher.name) ? source.publisher.name.charAt(0) + source.publisher.name.substring(1).toLowerCase() : ''}
          </span>
        </span>
      );
    }
    return null;
  }

  _renderThemes(source) {
    let themeNodes;
    const { theme } = source;
    if (theme) {
      themeNodes = theme.map((singleTheme, index) => (
        <div
          key={`dataset-description-theme-${index}`}
          id={`dataset-description-theme-${index}`}
          className="fdk-label"
        >
          {singleTheme.title[this.props.selectedLanguageCode] || singleTheme.title.nb || singleTheme.title.nn || singleTheme.title.en}
        </div>
      ));
    }
    return themeNodes;
  }

  _renderSample(source) {
    const { sample } = source;
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
    const result = this.state.result;
    const source = _.extend({}, result._source, result.highlight);

    // Read fields from search-hit, use correct language field if specified.
    const hitId = encodeURIComponent(source.id);
    const hitElementId = `search-hit-${hitId}`;
    const title = source.title[language] || source.title.nb || source.title.nn || source.title.en;
    let description = source.description[language] || source.description.nb || source.description.nn || source.description.en;
    if (description.length > 220) {
      description = `${description.substr(0, 220)}...`;
    }
    const link = `/datasets/${hitId}`;

    let accessRightsLabel;
    let distributionNonPublic = false;
    let distributionRestricted = false;
    let distributionPublic = false;

    let authorityCode = '';
    if (source.accessRights && source.accessRights.code) {
      authorityCode = source.accessRights.code;
    }

    if (source.accessRights && authorityCode === 'NON_PUBLIC') {
      distributionNonPublic = true;
      accessRightsLabel = localization.dataset.accessRights.authorityCode.nonPublic;
    } else if (source.accessRights && authorityCode === 'RESTRICTED') {
      distributionRestricted = true;
      accessRightsLabel = localization.dataset.accessRights.authorityCode.restricted;
    } else if (source.accessRights && authorityCode === 'PUBLIC') {
      distributionPublic = true;
      accessRightsLabel = localization.dataset.accessRights.authorityCode.public;
    } else if (!source.accessRights) { // antar public hvis authoritycode mangler
      distributionPublic = true;
      accessRightsLabel = localization.dataset.accessRights.authorityCode.public;
    }

    const distributionClass = cx(
      'fdk-container-distributions',
      {
        'fdk-distributions-red': distributionNonPublic,
        'fdk-distributions-yellow': distributionRestricted,
        'fdk-distributions-green': distributionPublic
      }
    );

    return (
      <a
        id={hitElementId}
        className="fdk-a-search-hit"
        title={`${localization.result.dataset}: ${title}`}
        href={link}
      >
        <div className="fdk-container fdk-container-search-hit">
          <h2 id="search-hit-title">{title}</h2>
          <div>
            {this._renderPublisher(source)}
            {this._renderThemes(source)}
          </div>
          <p
            className="fdk-p-search-hit block-with-textx"
          >
            {description}
          </p>
          <div className={distributionClass}>
            <strong>{accessRightsLabel}</strong>
            <br />
            {this._renderFormats(source, authorityCode)}
            {this._renderSample(source)}
          </div>
        </div>
      </a>
    );
  }
}

SearchHitItem.defaultProps = {
  result: null,
  selectedLanguageCode: 'nb'
};

SearchHitItem.propTypes = {
  result: PropTypes.shape({}),
  selectedLanguageCode: PropTypes.string
};
