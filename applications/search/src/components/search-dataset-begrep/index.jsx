import React from 'react';
import PropTypes from 'prop-types';

import BegrepCollapse from '../search-dataset-begrep-collapse';
import localization from '../../components/localization';
import { getTranslateText } from '../../utils/translateText';

export default class DatasetBegrep extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
    const { subject, selectedLanguageCode } = this.props;
    const children = items => items.map(item => {
      if (item.prefLabel && item.definition) {
        return (
          <BegrepCollapse
            key={item.uri}
            prefLabel={item.prefLabel ? getTranslateText(item.prefLabel, selectedLanguageCode) : null}
            definition={item.definition ? getTranslateText(item.definition, selectedLanguageCode) : null}
            note={item.note ? getTranslateText(item.note, selectedLanguageCode) : null}
            source={item.source}
          />
        );
      }
    });
    if (subject) {
      return (
        <div>
          <div className="fdk-container-detail fdk-container-detail-header">
            <i className="fa fa-book fdk-fa-left fdk-color-cta" />
            {localization.dataset.subject}
          </div>
          { children(subject) }
        </div>
      );
    }
    return null;
  }

  _renderKeyword() {
    const { keyword, selectedLanguageCode } = this.props;
    const children = items => items.map((item, index) => {
      if (index > 0) {
        return (
          <span
            key={`dataset-begrep-search-${index}`}
          >
            {`, ${getTranslateText(item, selectedLanguageCode)}`}
          </span>
        );
      }
      return (
        <span
          key={`dataset-begrep-search-${index}`}
        >
          {getTranslateText(item, selectedLanguageCode)}
        </span>
      );
    });
    if (keyword) {
      return (
        <div className="fdk-container-detail fdk-container-detail-begrep mt-60">
          <div className="fdk-detail-icon"><i className="fa fa-search" /></div>
          <div className="fdk-detail-text">
            <h5>{localization.dataset.keyword}</h5>
            <p className="fdk-ingress fdk-margin-bottom-no">
              { children(keyword) }
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div>
        { this._renderBegrep() }
        { this._renderKeyword() }
      </div>
    );
  }
}

DatasetBegrep.defaultProps = {
  subject: null,
  keyword: null,
  selectedLanguageCode: ''
};

DatasetBegrep.propTypes = {
  subject: PropTypes.array,
  keyword: PropTypes.array,
  selectedLanguageCode: PropTypes.string
};
