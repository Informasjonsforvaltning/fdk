import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import qs from 'qs';
import DocumentMeta from 'react-document-meta';

import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';
import { LinkExternal } from '../../components/link-external/link-external.component';
import './concept-compare.scss';

const onDeleteConcept = (id, history, conceptIdsArray, removeConcept) => {
  removeConcept(id);
  const filteredConceptIds = conceptIdsArray.filter(item => item !== id);
  history.push(`?compare=${filteredConceptIds}`);
};

const renderTitle = (label, items, field) => {
  const fields = items =>
    Object.keys(items).map((item, index) => (
      <th key={`row-title-${field}-${index}`}>
        <h3>{getTranslateText(_.get(items[item], field))}</h3>
      </th>
    ));

  return (
    <thead className="sticky">
      <tr>
        <th>{label}</th>
        {fields(items)}
      </tr>
    </thead>
  );
};

const existFieldValue = value =>
  Array.isArray(value) ? value.some(valueItem => !!valueItem) : !!value;

const existValuesOnAnyItem = (items, fieldPath) =>
  Object.values(items).some(item => existFieldValue(_.get(item, fieldPath)));

const renderFieldValue = (item, fieldPath, index) => {
  const fieldValue = _.get(item, fieldPath);
  const renderArrayItem = (value, index) => (
    <span key={index} className="mr-2">
      {getTranslateText(value)}
    </span>
  );

  return (
    <td key={`row-${fieldPath}-${index}`}>
      {Array.isArray(fieldValue)
        ? fieldValue.map(renderArrayItem)
        : getTranslateText(fieldValue)}
    </td>
  );
};

const renderRow = (label, items, fieldPath) => {
  if (!existValuesOnAnyItem(items, fieldPath)) {
    return null;
  }
  return (
    <tr>
      <td>
        <strong>{label}</strong>
      </td>
      {Object.values(items).map((item, index) =>
        renderFieldValue(item, fieldPath, index)
      )}
    </tr>
  );
};

const renderRowUrl = (label, items, fieldPath) => {
  const urlItem = (item, fieldPath, index) => {
    const fieldValue = _.get(item, fieldPath);
    return (
      <td key={`row-${fieldPath}-${index}`}>
        {_.get(fieldValue, 'uri') ? (
          <LinkExternal
            uri={_.get(fieldValue, 'uri')}
            prefLabel={
              _.get(fieldValue, 'prefLabel') || _.get(fieldValue, 'uri')
            }
          />
        ) : (
          getTranslateText(_.get(fieldValue, 'prefLabel'))
        )}
      </td>
    );
  };

  if (!existValuesOnAnyItem(items, fieldPath)) {
    return null;
  }

  return (
    <tr>
      <td>
        <strong>{label}</strong>
      </td>
      {Object.values(items).map((item, index) =>
        urlItem(item, fieldPath, index)
      )}
    </tr>
  );
};

const renderRemoveItem = (items, history, conceptIdsArray, removeConcept) => {
  const removeButtons = items =>
    Object.keys(items).map((item, index) => (
      <td key={`row-button-${index}`}>
        <button
          type="button"
          className="btn fdk-text-size-15 fdk-color-link bg-transparent"
          onClick={() => {
            onDeleteConcept(
              _.get(items, [item, 'id']),
              history,
              conceptIdsArray,
              removeConcept
            );
          }}
        >
          <i className="fa fa-minus-circle" />
          &nbsp;
          {localization.compare.removeCompare}
        </button>
      </td>
    ));

  return (
    <tr>
      <td />
      {removeButtons(items)}
    </tr>
  );
};

export const ConceptComparePage = props => {
  const {
    conceptsCompare,
    fetchConceptsToCompareIfNeeded,
    removeConcept,
    location,
    history
  } = props;
  const search = qs.parse(_.get(location, 'search'), {
    ignoreQueryPrefix: true
  });
  const conceptIdsArray = _.get(search, 'compare', '').split(',');
  fetchConceptsToCompareIfNeeded(conceptIdsArray);

  const meta = {
    title: localization.menu.conceptsCompare
  };

  return (
    <main id="content" className="container">
      <article>
        <div className="row">
          <div className="col-12">
            <DocumentMeta {...meta} />
            {conceptsCompare && (
              <>
                <h1 className="title">
                  {localization.menu.conceptsCompare} (
                  {Object.keys(conceptsCompare).length})
                </h1>

                <section className="scrollable">
                  <table className="table">
                    {renderTitle(
                      localization.facet.concept,
                      conceptsCompare,
                      'prefLabel'
                    )}
                    <tbody>
                      {renderRow(localization.responsible, conceptsCompare, [
                        'publisher',
                        'prefLabel'
                      ])}
                      {renderRow(
                        localization.compare.definition,
                        conceptsCompare,
                        ['definition', 'text']
                      )}
                      {renderRowUrl(
                        localization.compare.source,
                        conceptsCompare,
                        ['definition', 'source']
                      )}
                      {renderRow(
                        localization.compare.subject,
                        conceptsCompare,
                        'subject'
                      )}
                      {renderRow(
                        localization.compare.altLabel,
                        conceptsCompare,
                        'altLabel'
                      )}
                      {renderRow(
                        localization.compare.hiddenLabel,
                        conceptsCompare,
                        'hiddenLabel'
                      )}

                      {renderRemoveItem(
                        conceptsCompare,
                        history,
                        conceptIdsArray,
                        removeConcept
                      )}
                    </tbody>
                  </table>
                </section>
              </>
            )}
          </div>
        </div>
      </article>
    </main>
  );
};

ConceptComparePage.defaultProps = {
  conceptsCompare: null,
  fetchConceptsToCompareIfNeeded: _.noop
};

ConceptComparePage.propTypes = {
  fetchConceptsToCompareIfNeeded: PropTypes.func,
  conceptsCompare: PropTypes.object
};
