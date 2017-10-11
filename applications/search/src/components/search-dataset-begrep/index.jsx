import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';
import cx from 'classnames';

import localization from '../../components/localization';

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

  _renderHeader() {
    return (
      <div className="fdk-container-detail fdk-container-detail-header">
        <i className="fa fa-book fdk-fa-left fdk-color-cta" />
        {localization.dataset.subject}
      </div>
    );
  }
  _renderBegrep() {
    return (
      <div className="fdk-ingress fdk-margin-bottom-no" onClick={this.toggle}>
        <strong className="pull-left">Jordsmonn:&nbsp;</strong>
        <i className="fa fa-chevron-down fdk-fa-right fdk-float-right" />
        {!this.state.detailed &&
        <div>
          {this.props.description.substr(0, 30)}...
        </div>
        }

        <Collapse in={this.state.detailed}>
          <div>
            {this.props.description}
          </div>
        </Collapse>
      </div>
    );
  }

  _renderKeyword() {
    let keywordNodes;
    const { keyword } = this.props;
    if (keyword) {
      keywordNodes = keyword.map((item, index) => {
        if (index > 0) {
          return (
            <span
              key={`dataset-begrep-search-${index}`}
            >
              {`, ${item[this.props.selectedLanguageCode] || item.nb || item.nn || item.en}`}
            </span>
          );
        }
        return (
          <span
            key={`dataset-begrep-search-${index}`}
          >
            {`${item[this.props.selectedLanguageCode] || item.nb || item.nn || item.en}`}
          </span>
        );
      });
      return keywordNodes;
    }
    return null;
  }

  render() {
    return (
      <div>
        {this._renderHeader()}
        <div className="fdk-container-detail fdk-container-detail-begrep">
          <div className="fdk-detail-icon"><i className="fa fa-search"></i></div>
          <div className="fdk-detail-text">
            <h5>{localization.dataset.keyword}</h5>
            <p className="fdk-ingress fdk-margin-bottom-no">
              {this._renderKeyword()}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

DatasetBegrep.defaultProps = {
  title: null,
  description: null,
  keyword: null
};

DatasetBegrep.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keyword: PropTypes.array
};
