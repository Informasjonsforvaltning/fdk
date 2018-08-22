import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import localization from '../../../../lib/localization';
import { getTranslateText } from '../../../../lib/translateText';
import { PublisherLabel } from '../../../../components/publisher-label/publisher-label.component';
import './concepts-hit-item.scss';

const renderPublisher = source => {
  const { creator } = source;

  if (!creator) {
    return null;
  }
  return <PublisherLabel publisherItem={creator} />;
};

const renderThemes = source => {
  const { inScheme } = source;
  const children = items =>
    items.map((item, index) => {
      const subItem = item.substring(item.lastIndexOf('/') + 1);
      return (
        <span
          key={`dataset-description-inScheme-${index}`}
          className="fdk-label"
        >
          <span className="uu-invisible" aria-hidden="false">
            Tema.
          </span>
          {subItem}
        </span>
      );
    });
  if (inScheme) {
    return <div className="mt-3">{children(inScheme)}</div>;
  }
  return null;
};

const renderLaw = _source => {
  const { source } = _source;
  if (source) {
    return (
      <div>
        <span className="fa-stack fdk-fa-left fdk-fa-circle">
          <i className="fa fa-file-text fa-stack-1x fdk-color0" />
        </span>
        <a title="Link til lovhjemmel for begrep" href={source}>
          <span className="uu-invisible" aria-hidden="false">
            Link til lovhjemmel for begrep.
          </span>
          {source}
          <i className="fa fa-external-link fdk-fa-right" />
        </a>
      </div>
    );
  }
  return null;
};

const renderNote = source => {
  const { note } = source;
  if (note) {
    return <p className="fdk-p-search-hit">{getTranslateText(note)}</p>;
  }
  return null;
};

const renderAltLabel = source => {
  const { altLabel } = source;
  const children = items =>
    items.map((item, index) => {
      if (index > 0) {
        return (
          <span key={`concepts-altlabel-${index}`}>
            {`, ${getTranslateText(item)}`}
          </span>
        );
      }
      return (
        <span key={`concepts-altlabel-${index}`}>
          {`${getTranslateText(item)}`}
        </span>
      );
    });
  if (altLabel) {
    return (
      <p>
        <span className="uu-invisible" aria-hidden="false">
          Begrep er
        </span>
        <strong>{localization.terms.altLabel} </strong>
        {children(altLabel)}
      </p>
    );
  }
  return null;
};

const renderDocCount = result => {
  const { _source } = result;

  const subjectCountItem = _source.datasets ? _source.datasets.length : 0;
  if (subjectCountItem > 0 && _source.prefLabel) {
    return (
      <p>
        <a
          className="fdk-hit-dataset-count"
          title="Link til datasett med begrep"
          href={`/?subject=${getTranslateText(_source.prefLabel)}`}
        >
          {localization.terms.docCount} {subjectCountItem}{' '}
          {localization.terms.docCountPart2}
        </a>
      </p>
    );
  }
  return null;
};

export const ConceptsHitItem = props => {
  const { onAddTerm } = props;
  const { _source } = props.result;
  const { prefLabel, definition, uri } = _source;

  let termTitle;
  let termDescription;

  if (prefLabel) {
    termTitle = getTranslateText(prefLabel);
    termTitle =
      termTitle.charAt(0).toUpperCase() + termTitle.substring(1).toLowerCase();
  }
  if (definition) {
    termDescription = getTranslateText(definition);
  }

  let toBeCompared = false;
  if (props.terms) {
    toBeCompared = _.some(props.terms, term => term.uri === uri);
  }

  return (
    <article
      className="fdk-a-search-hit"
      title={`Begrep: ${termTitle}`}
      tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
    >
      <span className="uu-invisible" aria-hidden="false">
        Søketreff begrep.
      </span>
      <div
        className={`fdk-container-search-hit ${
          toBeCompared ? 'toBeCompared' : ''
        }`}
      >
        {!toBeCompared && (
          <button
            className="btn btn-primary fdk-button float-right mt-3 d-none d-lg-inline"
            onClick={() => {
              onAddTerm(_source);
            }}
            type="button"
          >
            <span aria-hidden="true">+</span>
            {localization.compare.addCompare}
          </button>
        )}

        {!toBeCompared && (
          <button
            className="fdk-button fdk-button-default fdk-btn-compare d-block d-lg-none"
            onClick={() => {
              onAddTerm(_source);
            }}
            type="button"
          >
            <span aria-hidden="true">+</span>
            {localization.compare.addCompare}
          </button>
        )}

        <span className="uu-invisible" aria-hidden="false">
          Tittel.
        </span>
        <h2 className="inline-block mr-2">{termTitle}</h2>

        {renderPublisher(_source)}

        {renderThemes(_source)}

        <p className="fdk-p-search-hit">
          <span className="uu-invisible" aria-hidden="false">
            Beskrivelse av begrep.
          </span>
          {termDescription}
        </p>

        {renderLaw(_source)}

        <hr />

        {renderNote(_source)}

        {renderAltLabel(_source)}

        {renderDocCount(props.result)}
      </div>
    </article>
  );
};

ConceptsHitItem.defaultProps = {
  result: null,
  terms: null
};

ConceptsHitItem.propTypes = {
  result: PropTypes.shape({}),
  terms: PropTypes.array,
  onAddTerm: PropTypes.func.isRequired
};
