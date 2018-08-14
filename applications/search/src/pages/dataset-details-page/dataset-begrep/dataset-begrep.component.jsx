import React from 'react';
import PropTypes from 'prop-types';

import { BegrepCollapse } from './begrep-collapse/begrep-collapse.component';
import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';

export class DatasetBegrep extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      detailed: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ detailed: !this.state.detailed });
  }

  _renderBegrep() {
    const { subject } = this.props;
    const children = items =>
      items.map(item => {
        if (item.prefLabel && item.definition) {
          return (
            <BegrepCollapse
              key={item.uri}
              prefLabel={getTranslateText(item.prefLabel)}
              definition={getTranslateText(item.definition)}
              note={getTranslateText(item.note)}
              source={item.source}
            />
          );
        }
        return null;
      });
    if (subject) {
      return (
        <div>
          <div className="fdk-container-detail fdk-container-detail-header">
            <i className="fa fa-book fdk-fa-left fdk-color-cta" />
            {localization.dataset.subject}
          </div>
          {children(subject)}
        </div>
      );
    }
    return null;
  }

  _renderKeyword() {
    const { keyword } = this.props;
    const children = items =>
      items.map((item, index) => {
        if (index > 0) {
          return (
            <span key={`dataset-begrep-search-${index}`} className="keyword">
              {`, ${getTranslateText(item)}`}
            </span>
          );
        }
        return (
          <span key={`dataset-begrep-search-${index}`} className="keyword">
            {getTranslateText(item)}
          </span>
        );
      });
    if (keyword) {
      return (
        <div className="fdk-container-detail fdk-container-detail-begrep mt-5">
          <div className="fdk-detail-icon">
            <i className="fa fa-search" />
          </div>
          <div className="fdk-detail-text">
            <h5>{localization.dataset.keyword}</h5>
            <p className="fdk-ingress mb-0">{children(keyword)}</p>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <section>
        {this._renderBegrep()}
        {this._renderKeyword()}
      </section>
    );
  }
}

DatasetBegrep.defaultProps = {
  subject: null,
  keyword: null
};

DatasetBegrep.propTypes = {
  subject: PropTypes.array,
  keyword: PropTypes.array
};
