import React from 'react';
import PropTypes from 'prop-types';
import DocumentMeta from 'react-document-meta';
import Moment from 'react-moment';

import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';
import { ShowMore } from '../../../components/show-more/show-more';
import { DatasetLabelNational } from '../../../components/dataset-label-national/dataset-label-national.component';

export class DatasetDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false
    };
    this.toggleShowAll = this.toggleShowAll.bind(this);
  }

  toggleShowAll() {
    this.setState({ showAll: !this.state.showAll });
  }

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

  _renderHarvestSeparator() {
    const { harvest } = this.props;
    if (harvest && harvest.firstHarvested && harvest.lastChanged) {
      return <span>&nbsp;/&nbsp;</span>;
    }
    return null;
  }

  _renderLastChanged() {
    const { harvest } = this.props;
    if (harvest && harvest.lastChanged) {
      return (
        <span>
          {localization.dataset.lastChanged}&nbsp;
          <Moment format="DD.MM.YYYY">{harvest.lastChanged}</Moment>
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

        <div className="fdk-detail-date">
          {this._renderHarvested()}
          {this._renderHarvestSeparator()}
          {this._renderLastChanged()}
        </div>

        <div className="fdk-margin-bottom">
          {this._renderPublisher()}
          {this._renderThemes()}
          {this.props.provenance &&
            this.props.provenance.code === 'NASJONAL' && (
              <DatasetLabelNational />
            )}
        </div>

        {this.props.description && (
          <ShowMore
            showMoreButtonText={localization.showFullDescription}
            label={localization.description}
            contentHtml={this.props.descriptionFormatted}
          />
        )}

        {this.props.objective && (
          <ShowMore
            showMoreButtonText={localization.showFullObjective}
            label={localization.objective}
            contentHtml={this.props.objective}
          />
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
  harvest: null,
  provenance: null
};

DatasetDescription.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  descriptionFormatted: PropTypes.string,
  objective: PropTypes.string,
  publisher: PropTypes.object,
  themes: PropTypes.array,
  selectedLanguageCode: PropTypes.string,
  harvest: PropTypes.object,
  provenance: PropTypes.object
};
