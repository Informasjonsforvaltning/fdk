import React from 'react';
import PropTypes from 'prop-types';
import DocumentMeta from 'react-document-meta';
import Moment from 'react-moment';

import localization from '../../components/localization';
import { getTranslateText } from '../../utils/translateText';

export default class DatasetDescription extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  _renderPublisher() {
    const { publisher } = this.props;
    const ownedBy = localization.search_hit.owned;
    if (publisher && publisher.name) {
      return (
        <span>
          {ownedBy}&nbsp;
          <strong
            id="dataset-descritption-publisher-text"
            className="fdk-strong-virksomhet"
          >
            {publisher
              ? publisher.name.charAt(0) +
                publisher.name.substring(1).toLowerCase()
              : ''}
          </strong>
        </span>
      );
    }
    return null;
  }

  _renderHarvested() {
    const { harvest } = this.props;
    if (harvest && harvest.firstHarvested) {
      return (
        <span>
          {localization.dataset.firstHarvested}&nbsp;
          <Moment format="DD.MM.YYYY">{harvest.firstHarvested}</Moment>
        </span>
      );
    }
    return null;
  }

  _renderThemes() {
    let themeNodes = null;
    const { themes, selectedLanguageCode } = this.props;
    if (themes) {
      themeNodes = themes.map(singleTheme => (
        <div
          key={`dataset-description-theme-${singleTheme.code}`}
          id={`dataset-description-theme-${singleTheme.code}`}
          className="fdk-label fdk-label-on-grey mr-2 mb-2"
        >
          {getTranslateText(singleTheme.title, selectedLanguageCode)}
        </div>
      ));
    }
    return themeNodes;
  }

  render() {
    const meta = {
      title: this.props.title,
      description: this.props.description
    };
    return (
      <header id="dataset-description">
        <DocumentMeta {...meta} />
        {this.props.title && (
          <h1 className="fdk-margin-bottom">{this.props.title}</h1>
        )}

        <div className="fdk-detail-date">{this._renderHarvested()}</div>

        <div className="fdk-margin-bottom">
          {this._renderPublisher()}
          {this._renderThemes()}
        </div>

        {this.props.description && (
          <p
            className="fdk-ingress"
            dangerouslySetInnerHTML={{
              __html: this.props.descriptionFormatted
            }}
          />
        )}

        {this.props.objective && (
          <p className="fdk-ingress">{this.props.objective}</p>
        )}
      </header>
    );
  }
}

DatasetDescription.defaultProps = {
  title: '',
  description: '',
  descriptionFormatted: null,
  objective: '',
  publisher: null,
  themes: null,
  selectedLanguageCode: '',
  harvest: null
};

DatasetDescription.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  descriptionFormatted: PropTypes.string,
  objective: PropTypes.string,
  publisher: PropTypes.object,
  themes: PropTypes.array,
  selectedLanguageCode: PropTypes.string,
  harvest: PropTypes.object
};
