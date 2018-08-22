import React from 'react';
import PropTypes from 'prop-types';
import DocumentMeta from 'react-document-meta';
import Moment from 'react-moment';

import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';
import { ShowMore } from '../../../components/show-more/show-more';
import { DatasetLabelNational } from '../../../components/dataset-label-national/dataset-label-national.component';
import { PublisherLabel } from '../../../components/publisher-label/publisher-label.component';

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

    if (!publisher) {
      return null;
    }
    return (
      <PublisherLabel
        label={localization.search_hit.owned}
        publisherItem={publisher}
      />
    );
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
    const { themes } = this.props;
    if (themes) {
      themeNodes = themes.map(singleTheme => (
        <div
          key={`dataset-description-theme-${singleTheme.code}`}
          className="fdk-label fdk-label-on-grey mr-2 mb-2"
        >
          {getTranslateText(singleTheme.title)}
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
      <header>
        <DocumentMeta {...meta} />
        {this.props.title && <h1>{this.props.title}</h1>}

        <div className="fdk-detail-date">
          {this._renderHarvested()}
          {this._renderHarvestSeparator()}
          {this._renderLastChanged()}
        </div>

        <div className="mb-2">
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
  harvest: PropTypes.object,
  provenance: PropTypes.object
};
