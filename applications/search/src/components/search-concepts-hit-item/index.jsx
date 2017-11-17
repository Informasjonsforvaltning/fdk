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
    const { creator } = this.state.source;
    if (creator && creator.name) {
      return (
        <span className="inline-block">
          <strong>
            { creator.name.charAt(0) + creator.name.substring(1).toLowerCase() }
          </strong>
        </span>
      );
    }
    return null;
  }

  _renderThemes() {
    const { inScheme } = this.state.source;
    const children = items => items.map((item, index) => {
      const subItem = item.substring(item.lastIndexOf('/') + 1)
      return (
        <span
          key={`dataset-description-inScheme-${index}`}
          id={`dataset-description-inScheme-${index}`}
          className="fdk-label ml-2"
        >
          {subItem}
        </span>
      );
    });
    if (inScheme) {
      return (
        <div className="mt-3">
          { children(inScheme) }
        </div>
      );
    }
    return null;
  }

  _renderLaw() {
    const { source } = this.state.source;
    if (source) {
      return (
        <div>
          <span className="fa-stack fdk-fa-left fdk-fa-circle">
            <i className="fa fa-book fa-stack-1x fdk-color0" />
          </span>
          <a
            href={source}
          >
            {source}
            <i className="fa fa-external-link fdk-fa-right" />
          </a>
        </div>
      );
    }
    return null;
  }

  _renderNote() {
    const { note } = this.state.source;
    const { selectedLanguageCode } = this.props;
    if (note) {
      return (
        <p
          className="fdk-p-search-hit"
        >
          {getTranslateText(note, selectedLanguageCode)}
        </p>
      );
    }
    return null;
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
        <div>
          <strong>{localization.terms.altLabel} </strong>
          { children(altLabel) }
        </div>
      );
    }
    return null;
  }

  render() {
    const { onAddTerm, selectedLanguageCode } = this.props;
    const { source } = this.state;
    const { prefLabel, definition, uri  } = source;
    const hitElementId = `concepts-hit-${encodeURIComponent(uri)}`;

    let termTitle;
    let termDescription;

    if (prefLabel) {
      termTitle = getTranslateText(prefLabel, selectedLanguageCode);
      termTitle = termTitle.charAt(0).toUpperCase() + termTitle.substring(1).toLowerCase();
    }
    if (definition) {
      termDescription = getTranslateText(definition, selectedLanguageCode);
    }

    let toBeCompared = false;
    if (this.props.terms) {
      toBeCompared = _.some(this.props.terms, (term) => term.uri === uri);
    }

    return (
      <div
        id={hitElementId}
        className="fdk-a-search-hit"
        title={`Begrep: ${termTitle}`}
      >
        <div className={`fdk-container fdk-container-search-hit ${toBeCompared ? 'toBeCompared' : ''}`}>

          {!toBeCompared &&
          <button className='fdk-button fdk-button-default pull-right mt-3' onClick={() => {onAddTerm(source)}} type="button">+ {localization.compare.addCompare}</button>
          }

          <h2 className="inline-block mr-2">{termTitle}</h2>

          {this._renderPublisher()}

          {this._renderThemes()}

          <p
            className="fdk-p-search-hit"
          >
            {termDescription}
          </p>

          { this._renderLaw() }

          <hr />

          { this._renderNote() }

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
