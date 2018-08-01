import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import _capitalize from 'lodash/capitalize';

import { getTranslateText } from '../../../../../lib/translateText';
import localization from '../../../../../lib/localization';

export const CompareTermModalContent = props => {
  let { terms, cols } = props;
  terms =
    terms && terms.length > 0
      ? terms
      : CompareTermModalContent.defaultProps.terms;
  cols = cols || CompareTermModalContent.defaultProps.cols;

  const title = items =>
    items.map((item, index) => {
      const { creator } = item;

      const publisherPrefLabel =
        getTranslateText(_get(creator, ['prefLabel'])) ||
        _capitalize(_get(creator, 'name', ''));

      return (
        <div className={cols} key={`title-${index}${item.uri}`}>
          <h3>
            {item && getTranslateText(item.prefLabel)
              ? getTranslateText(item.prefLabel)
                  .charAt(0)
                  .toUpperCase() +
                getTranslateText(item.prefLabel)
                  .substring(1)
                  .toLowerCase()
              : ''}
          </h3>
          <h5>{publisherPrefLabel}</h5>
        </div>
      );
    });

  const definition = items =>
    items.map((item, index) => (
      <div className={cols} key={`definition-${index}${item.uri}`}>
        <h5>{localization.compare.definition}</h5>
        <p>
          {getTranslateText(item.definition)
            ? getTranslateText(item.definition)
                .charAt(0)
                .toUpperCase() + getTranslateText(item.definition).substring(1)
            : ''}
        </p>
      </div>
    ));

  const inSchemeList = [];
  for (let i = 0; i < terms.length; i += 1) {
    let inScheme = '';
    if (terms[i].inScheme) {
      for (let j = 0; j < terms[i].inScheme.length; j += 1) {
        inScheme += terms[i].inScheme[j].substring(
          terms[i].inScheme[j].lastIndexOf('/') + 1
        );
        if (j < terms[i].inScheme.length - 1) {
          inScheme += ', ';
        }
      }
      inScheme += '.';
    }
    inSchemeList.push(inScheme);
  }

  const inScheme = items =>
    items.map((item, index) => (
      <div className={cols} key={`inScheme-${index}${item.uri}`}>
        <h5>{localization.compare.inScheme}</h5>
        <p>{item}</p>
      </div>
    ));

  const source = items =>
    items.map((item, index) => (
      <div className={cols} key={`source-${index}${item.uri}`}>
        <h5>{localization.compare.source}</h5>
        <p>
          {item.source ? (
            <a href={item.source}>
              {item.source}
              &nbsp;
              <i className="fa fa-external-link" />
            </a>
          ) : (
            ''
          )}
        </p>
      </div>
    ));

  const note = items =>
    items.map((item, index) => (
      <div className={cols} key={`note-${index}${item.uri}`}>
        <h5>{localization.compare.note}</h5>
        <p>{getTranslateText(item.note)}</p>
      </div>
    ));

  const altLabelList = [];
  for (let i = 0; i < terms.length; i += 1) {
    let altLabel = '';
    if (terms[i].altLabel) {
      for (let j = 0; j < terms[i].altLabel.length; j += 1) {
        if (getTranslateText(terms[i].altLabel[j])) {
          altLabel += getTranslateText(terms[i].altLabel[j]);
          if (j < terms[i].altLabel.length - 1) {
            altLabel += ', ';
          }
        }
      }
      altLabel += '.';
    }
    altLabelList.push(altLabel);
  }

  const altLabel = items =>
    items.map((item, index) => (
      <div className={cols} key={`altLabel-${index}${item.uri}`}>
        <h5>{localization.compare.altLabel}</h5>
        <p>{item}</p>
      </div>
    ));

  return (
    <div>
      <div className="row">{title(terms)}</div>
      <hr />
      <div className="row">{definition(terms)}</div>
      <hr />
      <div className="row">{inScheme(inSchemeList)}</div>
      <hr />
      <div className="row">{source(terms)}</div>
      <hr />
      <div className="row">{note(terms)}</div>
      <hr />
      <div className="row">{altLabel(altLabelList)}</div>
    </div>
  );
};

CompareTermModalContent.defaultProps = {
  terms: [
    {
      uri: '',
      identifier: '',
      prefLabel: {
        nb: ''
      },
      definition: {
        nb: ''
      },
      note: {
        nb: ''
      },
      source: '',
      creator: {
        name: ''
      },
      inScheme: ['']
    }
  ],
  cols: 'col-md-6'
};

CompareTermModalContent.propTypes = {
  terms: PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string,
      identifier: PropTypes.string,
      prefLabel: PropTypes.shape({}),
      definition: PropTypes.shape({}),
      note: PropTypes.shape({}),
      source: PropTypes.string,
      creator: PropTypes.shape({}),
      inScheme: PropTypes.array
    })
  ),
  cols: PropTypes.string
};
