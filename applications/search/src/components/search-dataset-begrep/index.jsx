import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';

import BegrepCollapse from '../search-dataset-begrep-collapse';
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

  _renderBegrep() {
    const { subject } = this.props;
    const children = items => items.map(item => (
      <BegrepCollapse
        key={item.uri}
        prefLabel={item.prefLabel ?
          item.prefLabel[this.props.selectedLanguageCode]
          || item.prefLabel.nb
          || item.prefLabel.no
          || item.prefLabel.nn
          || item.prefLabel.en
          : null
        }
        definition={item.definition ?
          item.definition[this.props.selectedLanguageCode]
          || item.definition.nb
          || item.definition.no
          || item.definition.nn
          || item.definition.en
          : null}
        note={item.note ?
          item.note[this.props.selectedLanguageCode]
          || item.note.nb
          || item.note.no
          || item.note.nn
          || item.note.en
          : null}
        source={item.source}
      />
    ));
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

  _renderBegrep2() {
    return (
      <div className="fdk-ingress fdk-margin-bottom-no" role="button" tabIndex={0} onClick={this.toggle}>
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
    const { keyword } = this.props;
    const children = items => items.map((item, index) => {
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
  subjet: null,
  keyword: null,
  selectedLanguageCode: ''
};

DatasetBegrep.propTypes = {
  description: PropTypes.array,
  keyword: PropTypes.array,
  selectedLanguageCode: PropTypes.string
};
