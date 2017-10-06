import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../components/localization';

export default class DatasetDescription extends React.Component { // eslint-disable-line react/prefer-stateless-function
  _renderPublisher() {
    const publisher = this.props.publisher;
    if (publisher && publisher.name && publisher.id) {
      return (
        <span>
          {localization.search_hit.owned}&nbsp;
          <a
            id="dataset-descritption-publisher-link"
            href={publisher.id}
          >
            <span id="dataset-descritption-publisher-text">
              {publisher ? publisher.name.charAt(0) + publisher.name.substring(1).toLowerCase() : ''}
            </span>
          </a>
        </span>
      );
    } else if (publisher && publisher.name) {
      return (
        <span>
          {localization.search_hit.owned}&nbsp;
          <span id="dataset-descritption-publisher-text">
            {publisher ? publisher.name.charAt(0) + publisher.name.substring(1).toLowerCase() : ''}
          </span>
        </span>
      );
    }
    return null;
  }

  _renderThemes() {
    let themeNodes;
    const themes = this.props.themes;
    if (themes) {
      themeNodes = themes.map((singleTheme, index) => (
        <a
          key={`theme-${index}`}
          href={singleTheme.id}
        >
          <div id={`dataset-description-theme-${index}`} className="fdk-label">
            {singleTheme.title[this.props.selectedLanguageCode] || singleTheme.title.nb || singleTheme.title.nn || singleTheme.title.en}
          </div>
        </a>
      ));
    }
    return themeNodes;
  }

  render() {
    return (
      <div id="dataset-description">
        {this.props.title &&
        <h1 className="fdk-margin-bottom">
          {this.props.title}
        </h1>
        }

        <div className="fdk-margin-bottom">
          {this._renderPublisher()}
          {this._renderThemes()}
        </div>
        {this.props.description &&
        <p className="fdk-ingress">
          {this.props.description}
        </p>
        }

      </div>
    );
  }
}

DatasetDescription.defaultProps = {
  title: null,
  description: null,
  publisher: null,
  themes: null,
  selectedLanguageCode: null
};

DatasetDescription.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  publisher: PropTypes.shape({}),
  themes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  selectedLanguageCode: PropTypes.string
};
