import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import localization from '../../components/localization';
import { getTranslateText } from '../../utils/translateText';
import './index.scss';

export default class ConceptsHitItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      source: _.extend({}, props.result._source)
    };
  }

  componentDidUpdate() {
    this.state = {
      source: _.extend({}, this.props.result._source)
    };
  }

  _renderPublisher() {
    const { publisher } = this.state.source;
    if (publisher && publisher.name) {
      return (
        <span className="inline-block">
          <strong>
            {
              (publisher && publisher.name)
                ? publisher.name.charAt(0) + publisher.name.substring(1).toLowerCase()
                : ''
            }
          </strong>
        </span>
      );
    }
    return null;
  }

  _renderThemes() {
    let themeNodes;
    const { theme } = this.state.source;
    if (theme) {
      themeNodes = theme.map((singleTheme, index) => (
        <span
          key={`dataset-description-theme-${index}`}
          id={`dataset-description-theme-${index}`}
          className="fdk-label"
        >
          {getTranslateText(singleTheme.title, this.props.selectedLanguageCode)}
        </span>
      ));
    }
    return themeNodes;
  }

  _renderAltLabel() {
    const { altLabel } = this.state.source;
    const { selectedLanguageCode } = this.props;
    const children = items => items.map((item, index) => {
      if (index > 0) {
        return (
          <span
            key={`concepts-altlabel-${index}`}
          >
            {`, ${getTranslateText(item, selectedLanguageCode)}`}
          </span>
        );
      }
      return (
        <span
          key={`concepts-altlabel-${index}`}
        >
          {`${getTranslateText(item, selectedLanguageCode)}`}
        </span>
      );
    });
    if (altLabel) {
      return (
        <p>
          <strong>{localization.terms.altLabel} </strong>
          { children(altLabel) }
        </p>
      );
    }
    return null;
  }

  render() {
    const { onAddTerm } = this.props;
    const { source } = this.state;
    const hitElementId = `concepts-hit-${encodeURIComponent(source.uri)}`;
    const { prefLabel, definition, note  } = source;

    let termTitle;
    let termDescription;
    let termNote;

    if (prefLabel) {
      termTitle = getTranslateText(prefLabel, this.props.selectedLanguageCode);
    }
    if (definition) {
      termDescription = getTranslateText(definition, this.props.selectedLanguageCode);
    }
    if (note) {
      termNote = getTranslateText(note, this.props.selectedLanguageCode);
    }

    let toBeCompared = false;
    if (this.props.terms) {
      toBeCompared = _.some(this.props.terms, (term) => term.uri === source.uri);
    }

    return (
      <div
        id={hitElementId}
        className="fdk-a-search-hit"
        title={`Begrep: ${termTitle}`}
      >
        <div className={`fdk-container fdk-container-search-hit ${toBeCompared ? 'toBeCompared' : ''}`}>
          <button className={`fdk-button ${toBeCompared ? 'fdk-button-inactive' : 'fdk-button-default'} pull-right mt-3`} onClick={() => { if (!toBeCompared) {onAddTerm(source)}}} type="button">+ {localization.compare.addCompare}</button>
          <h2 className="inline-block mr-2">{termTitle}</h2>
          {this._renderPublisher()}

          <div className="mt-3">
            {this._renderThemes()}
          </div>

          <p
            className="fdk-p-search-hit"
          >
            {termDescription}
          </p>

          <div>
            <span className="fa-stack fdk-fa-left fdk-fa-circle">
              <i className="fa fa-book fa-stack-1x fdk-color0" />
            </span>
            <a
              href="https://lovdata.no"
            >
              HARDKODET TEKST (https://lovdata.no)
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          </div>

          <hr />

          <p
            className="fdk-p-search-hit"
          >
            {termNote}
          </p>

          { this._renderAltLabel() }

        </div>
      </div>
    );
  }
}

ConceptsHitItem.defaultProps = {
  result: null,
  terms: null,
  selectedLanguageCode: 'nb'
};

ConceptsHitItem.propTypes = {
  result: PropTypes.shape({}),
  terms: PropTypes.array,
  onAddTerm: PropTypes.func.isRequired,
  selectedLanguageCode: PropTypes.string
};
