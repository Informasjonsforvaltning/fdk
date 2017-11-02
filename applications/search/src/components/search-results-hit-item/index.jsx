import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import cx from 'classnames';

import DistributionFormat from '../search-dataset-format';
import localization from '../../components/localization';
import { getTranslateText, getLanguageFromUrl } from '../../utils/translateText';
import './index.scss';

export default class SearchHitItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
        <span>
          {localization.search_hit.owned}&nbsp;
          <span id="search-hit-publisher-text">
            {
              (publisher && publisher.name)
                ? publisher.name.charAt(0) + publisher.name.substring(1).toLowerCase()
                : ''
            }
          </span>
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
        <div
          key={`dataset-description-theme-${index}`}
          id={`dataset-description-theme-${index}`}
          className="fdk-label"
        >
          {getTranslateText(singleTheme.title, this.props.selectedLanguageCode)}
        </div>
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
    console.log("test");
    const language = this.props.selectedLanguageCode;
    const langCode = getLanguageFromUrl();
    const langParam = langCode ? `?lang=${langCode}` : '';
    const { source } = this.state;

    // Read fields from search-hit, use correct language field if specified.
    const hitId = encodeURIComponent(source.id);
    const hitElementId = `search-hit-${hitId}`;
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
    }

    const distributionClass = cx(
      {
        'fdk-container-distributions': (distributionNonPublic || distributionRestricted || distributionPublic),
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
        href={`${link}${langParam}`}
      >
        <div className="fdk-container fdk-container-search-hit">
          <h2 id="search-hit-title">{title}</h2>
          <div>
            {this._renderPublisher}
            {this._renderThemes()}
          </div>
          <p
            className="fdk-p-search-hit block-with-textx"
          >
            {description}
          </p>

          <div className={distributionClass}>
            <strong>{accessRightsLabel}</strong>
            {this._renderFormats(authorityCode)}
            {this._renderSample()}
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
