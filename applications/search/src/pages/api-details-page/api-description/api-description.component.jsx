import React from 'react';
import PropTypes from 'prop-types';
import DocumentMeta from 'react-document-meta';
import Moment from 'react-moment';

import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';
import { DatasetLabelNational } from '../../../components/dataset-label-national/dataset-label-national.component';

export class ApiDescription extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderPublisher() {
    const { publisher } = this.props;
    const ownedBy = localization.search_hit.owned;
    if (publisher && publisher.name) {
      return (
        <span>
          {ownedBy}&nbsp;
          <strong className="fdk-strong-virksomhet">
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

  render() {
    const meta = {
      title: this.props.title,
      description: this.props.description
    };
    return (
      <header>
        <DocumentMeta {...meta} />

        <div className="fdk-detail-date mb-4">
          {this._renderHarvested()}
          {this._renderHarvestSeparator()}
          {this._renderLastChanged()}
        </div>

        {this.props.title && (
          <div className="mb-4 d-flex flex-wrap align-items-baseline">
            <h1 className="mr-3">{this.props.title}</h1>
            <DatasetLabelNational />
          </div>
        )}

        <div className="mb-4">{this._renderPublisher()}</div>
      </header>
    );
  }
}

ApiDescription.defaultProps = {
  title: '',
  description: '',
  publisher: null,
  harvest: null
};

ApiDescription.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  publisher: PropTypes.object,
  harvest: PropTypes.object
};
