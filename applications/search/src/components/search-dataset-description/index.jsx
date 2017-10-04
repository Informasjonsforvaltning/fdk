import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';

export default class DatasetDescription extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const language = this.props.selectedLanguageCode;
    const title = this.props.title[language] || this.props.title.nb || this.props.title.nn || this.props.title.en;
    const description =
      this.props.description[language] || this.props.description.nb || this.props.description.nn || this.props.description.en;

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
        <h1 className="fdk-margin-bottom">{title}</h1>
        <div className="fdk-margin-bottom">
          {localization.search_hit.owned}&nbsp;
          <a
            href={this.props.publisher.id}
          >
            {this.props.publisher ? this.props.publisher.name.charAt(0) + this.props.publisher.name.substring(1).toLowerCase() : ''}
          </a>
          <span dangerouslySetInnerHTML={{ __html: themeLabels }} />
        </div>
        <p className="fdk-ingress">
          {description}
        </p>
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
  title: PropTypes.object,
  description: PropTypes.object,
  publisher: PropTypes.object,
  themes: PropTypes.object,
  selectedLanguageCode: PropTypes.string
};
