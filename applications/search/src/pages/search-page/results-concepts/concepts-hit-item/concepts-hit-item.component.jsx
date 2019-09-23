import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import noop from 'lodash/noop';
import { Link } from 'react-router-dom';

import localization from '../../../../lib/localization';
import { getTranslateText } from '../../../../lib/translateText';
import { PublisherLabel } from '../../../../components/publisher-label/publisher-label.component';
import { LinkExternal } from '../../../../components/link-external/link-external.component';
import './concepts-hit-item.scss';

const renderAddRemoveCompareButton = (
  item,
  showCompare,
  onAddConcept,
  onDeleteConcept
) => {
  if (showCompare) {
    return (
      <button
        className="btn fdk-color-link bg-transparent fdk-text-size-15 fade-in-400"
        onClick={() => {
          onAddConcept(item);
        }}
        type="button"
      >
        <i className="fa fa-plus-circle mr-2" />
        {localization.compare.addCompare}
      </button>
    );
  }
  return (
    <button
      className="btn fdk-color-link bg-transparent fdk-text-size-15"
      onClick={() => {
        onDeleteConcept(_.get(item, 'id'));
      }}
      type="button"
    >
      <i className="fa fa-minus-circle mr-2" />
      {localization.compare.removeCompare}
    </button>
  );
};

const renderTitle = (title, id, deprecated = false) => {
  if (!title) {
    return null;
  }

  const link = `/concepts/${id}`;

  return (
    <>
      <Link
        className="search-hit__title-link"
        title={`${localization.apiLabel}: ${title}`}
        to={link}
      >
        <h2 className="mr-3" name={title}>
          {title}
        </h2>
      </Link>
      {deprecated && (
        <span className="fdk-color-neutral-dark fdk-text-extra-strong fdk-text-size-medium">
          ({localization.deprecated})
        </span>
      )}
    </>
  );
};

const renderPublisher = publisher => {
  if (!publisher) {
    return null;
  }

  return (
    <div className="mb-4">
      <PublisherLabel
        label={`${localization.responsible}:`}
        tag="span"
        publisherItem={publisher}
      />
    </div>
  );
};

const renderDescription = description => {
  if (!description) {
    return null;
  }
  let descriptionText = getTranslateText(description);
  if (descriptionText && descriptionText.length > 220) {
    descriptionText = `${descriptionText.substr(0, 220)}...`;
  }
  return (
    <p className="fdk-text-size-medium">
      <span className="uu-invisible" aria-hidden="false">
        {localization.compare.description}
      </span>
      {descriptionText}
    </p>
  );
};

const renderSource = ({ sourceRelationship = '', sources = [] }) => {
  if (sourceRelationship === 'egendefinert') {
    return (
      <div>
        <span>
          {`${localization.compare.source}: ${localization.sourceRelationship[sourceRelationship]}`}
        </span>
      </div>
    );
  }

  if (!sourceRelationship || sources.length === 0) {
    return null;
  }

  return (
    <div>
      <span>
        {`${localization.compare.source}: ${localization.sourceRelationship[sourceRelationship]}`}
      </span>
      {sources.map(({ text, uri }, index) => (
        <Fragment key={`${text}-${uri}`}>
          {index > 0 && ','}
          &nbsp;
          {uri ? (
            <LinkExternal uri={uri} prefLabel={text || uri} openInNewTab />
          ) : (
            getTranslateText(text)
          )}
        </Fragment>
      ))}
    </div>
  );
};

export const ConceptsHitItem = props => {
  const {
    concepts,
    onAddConcept,
    onDeleteConcept,
    fadeInCounter,
    result
  } = props;
  let showCompareButton = true;
  if (concepts) {
    showCompareButton = !_.some(
      concepts,
      term => term.uri === _.get(result, 'uri')
    );
  }

  const searchHitClass = cx('search-hit', {
    'fade-in-200': fadeInCounter === 0,
    'fade-in-300': fadeInCounter === 1,
    'fade-in-400': fadeInCounter === 2
  });

  return (
    <article
      className={searchHitClass}
      title={`Begrep: ${getTranslateText(_.get(result, 'prefLabel'))}`}
    >
      <span className="uu-invisible" aria-hidden="false">
        Søketreff begrep.
      </span>

      <div className="mb-2 d-flex flex-wrap align-items-baseline justify-content-between">
        {renderTitle(
          getTranslateText(_.get(result, 'prefLabel')),
          _.get(result, 'id')
        )}

        {renderAddRemoveCompareButton(
          result,
          showCompareButton,
          onAddConcept,
          onDeleteConcept
        )}
      </div>

      {renderPublisher(_.get(result, 'publisher'))}

      {renderDescription(_.get(result, ['definition', 'text']))}

      {renderSource(result.definition)}
    </article>
  );
};

ConceptsHitItem.defaultProps = {
  concepts: {},
  fadeInCounter: 0,
  onAddConcept: noop,
  onDeleteConcept: noop
};

ConceptsHitItem.propTypes = {
  result: PropTypes.shape({}).isRequired,
  concepts: PropTypes.object,
  onAddConcept: PropTypes.func,
  onDeleteConcept: PropTypes.func,
  fadeInCounter: PropTypes.number
};
