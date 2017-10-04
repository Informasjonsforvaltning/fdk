import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';

export default class DatasetDescription extends React.Component { // eslint-disable-line react/prefer-stateless-function

  _renderPublisher() {
    const publisher = this.props.publisher;
    if (publisher && publisher.name && publisher.id) {
      return (
        <span>
          {localization.search_hit.owned}&nbsp;
          <a
            href={publisher.id}
          >
            <span>
              {publisher ? publisher.name.charAt(0) + publisher.name.substring(1).toLowerCase() : ''}
            </span>
          </a>
        </span>
      );
    } else if (publisher && publisher.name) {
      return (
        <span>
          {localization.search_hit.owned}&nbsp;
          <span>
            {publisher ? publisher.name.charAt(0) + publisher.name.substring(1).toLowerCase() : ''}
          </span>
        </span>
      );
    }
    return null;
  }

  render() {
    const language = this.props.selectedLanguageCode;
    let themeLabels = '';
    const themes = this.props.themes;
    if (themes) {
      themes.forEach((singleTheme) => {
        if (singleTheme.title) {
          themeLabels += `<a href=${singleTheme.id}><div class="fdk-label">`;
          themeLabels += singleTheme.title[language] || singleTheme.title.nb || singleTheme.title.nn || singleTheme.title.en;
          themeLabels += ' </div></a>';
        }
      });
    }

    return (
      <div className="col-md-8">
        {this.props.title &&
        <h1 className="fdk-margin-bottom">
          {this.props.title}
        </h1>
        }

        <div className="fdk-margin-bottom">
          {this._renderPublisher()}
          <span dangerouslySetInnerHTML={{ __html: themeLabels }} />
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
  publisher: PropTypes.object,
  themes: PropTypes.array,
  selectedLanguageCode: PropTypes.string
};
