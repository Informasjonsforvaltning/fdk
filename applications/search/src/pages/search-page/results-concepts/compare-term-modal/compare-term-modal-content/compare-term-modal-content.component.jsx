import React from 'react';
import PropTypes from 'prop-types';
import { getTranslateText } from '../../../../../lib/translateText';
import localization from '../../../../../lib/localization';

export const CompareTermModalContent = props => {
  let { terms, selectedLanguageCode, cols } = props;
  terms =
    terms && terms.length > 0
      ? terms
      : CompareTermModalContent.defaultProps.terms;
  selectedLanguageCode =
    selectedLanguageCode ||
    CompareTermModalContent.defaultProps.selectedLanguageCode;
  cols = cols || CompareTermModalContent.defaultProps.cols;

  const title = items =>
    items.map((item, index) => (
      <div className={cols} key={`title-${index}${item.uri}`}>
        <h3>
          {item.prefLabel &&
          getTranslateText(item.prefLabel, selectedLanguageCode)
            ? getTranslateText(item.prefLabel, selectedLanguageCode)
                .charAt(0)
                .toUpperCase() +
              getTranslateText(item.prefLabel, selectedLanguageCode)
                .substring(1)
                .toLowerCase()
            : ''}
        </h3>
        <h5>
          {item.creator && item.creator.name
            ? item.creator.name.charAt(0).toUpperCase() +
              item.creator.name.substring(1)
            : ''}
        </h5>
      </div>
    ));

  const definition = items =>
    items.map((item, index) => (
      <div className={cols} key={`definition-${index}${item.uri}`}>
        <h5>{localization.compare.definition}</h5>
        <p>
          {item.definition &&
          getTranslateText(item.definition, selectedLanguageCode)
            ? getTranslateText(item.definition, selectedLanguageCode)
                .charAt(0)
                .toUpperCase() +
              getTranslateText(item.definition, selectedLanguageCode).substring(
                1
              )
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
        <p>
          {item.note && getTranslateText(item.note, selectedLanguageCode)
            ? getTranslateText(item.note, selectedLanguageCode)
            : ''}
        </p>
      </div>
    ));

  const altLabelList = [];
  for (let i = 0; i < terms.length; i += 1) {
    let altLabel = '';
    if (terms[i].altLabel) {
      for (let j = 0; j < terms[i].altLabel.length; j += 1) {
        if (getTranslateText(terms[i].altLabel[j], selectedLanguageCode)) {
          altLabel += getTranslateText(
            terms[i].altLabel[j],
            selectedLanguageCode
          );
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
  selectedLanguageCode: 'nb',
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
  selectedLanguageCode: PropTypes.string,
  cols: PropTypes.string
};
