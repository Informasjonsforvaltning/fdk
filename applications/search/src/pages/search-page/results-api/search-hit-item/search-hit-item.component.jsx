import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import _ from 'lodash';

import localization from '../../../../lib/localization';
import './search-hit-item.scss';
import { getTranslateText } from '../../../../lib/translateText';
import { SearchHitHeader } from '../../../../components/search-hit-header/search-hit-header.component';
import { convertToSanitizedHtml } from '../../../../lib/markdown-converter';

const renderHeaderLink = (item, publisher, publishers, referenceData) => {
  if (!item) {
    return null;
  }
  const { title } = item;
  const link = `/apis/${encodeURIComponent(item.id)}`;

  return (
    <header>
      <SearchHitHeader
        tag="h2"
        title={getTranslateText(title)}
        titleLink={link}
        publisherLabel={localization.api.provider}
        publisher={publisher}
        publisherItems={publishers}
        nationalComponent={item.nationalComponent}
        statusCode={item.statusCode}
        referenceData={referenceData}
      />
    </header>
  );
};

const renderDescription = descriptionFormatted => {
  if (!descriptionFormatted) {
    return null;
  }

  const sanitizedHtml = convertToSanitizedHtml(descriptionFormatted);

  // our naive cropping algorithm brutally abrupts the markup string.
  // It is a bit safer to do it in html markup than in markdown.
  const croppedHtml =
    sanitizedHtml.length < 250
      ? sanitizedHtml
      : `${sanitizedHtml.substr(0, 220)}...`;

  return (
    <div className="fdk-text-size-medium">
      <div className="uu-invisible" aria-hidden="false">
        Beskrivelse av api
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: croppedHtml
        }}
      />
    </div>
  );
};

const renderExpiredVersion = expired => {
  if (!expired) {
    return null;
  }
  return (
    <div className="search-hit__version mb-4 p-4">
      <span>Denne versjonen av API-et er utgått og vil fases ut i 2019. </span>
      <Link to="/TODO">Versjon 2 er dokumentert her.</Link>
    </div>
  );
};

const renderAccessRights = accessRights => {
  if (!(accessRights && accessRights[0])) {
    return null;
  }

  const { code } = accessRights[0] || {
    code: null
  };
  let accessRightsLabel;

  switch (code) {
    case 'NON_PUBLIC':
      accessRightsLabel = localization.api.accessRight.nonPublic;
      break;
    case 'RESTRICTED':
      accessRightsLabel = localization.api.accessRight.restricted;
      break;
    case 'PUBLIC':
      accessRightsLabel = localization.api.accessRight.public;
      break;
    default:
      accessRightsLabel = localization.api.accessRight.unknown;
  }

  return (
    <div className="mb-2">
      <strong>{accessRightsLabel}</strong>
    </div>
  );
};

const renderFormat = formats => {
  if (!formats || formats.length === 0) {
    return null;
  }

  const formatItems = formats =>
    formats.map((item, index) => (
      <span key={index}>
        {index > 0 ? ', ' : ''}
        {item}
      </span>
    ));

  return (
    <div className="mb-2">
      <strong>{localization.format}:&nbsp;</strong>
      {formatItems(formats)}
    </div>
  );
};

export const SearchHitItem = ({
  item,
  fadeInCounter,
  publishers,
  referenceData
}) => {
  const searchHitClass = cx('search-hit', {
    'fade-in-200': fadeInCounter === 0,
    'fade-in-300': fadeInCounter === 1,
    'fade-in-400': fadeInCounter === 2
  });

  return (
    <article className={searchHitClass}>
      <span className="uu-invisible" aria-hidden="false">
        Søketreff.
      </span>

      {renderHeaderLink(
        item,
        _.get(item, 'publisher'),
        publishers,
        referenceData
      )}

      {renderExpiredVersion(_.get(item, 'expired'))}

      {renderDescription(
        _.get(_.get(item, 'descriptionFormatted')) || _.get(item, 'description')
      )}

      {renderAccessRights(_.get(item, 'accessRights'))}

      {renderFormat(_.get(item, 'formats'))}
    </article>
  );
};

SearchHitItem.defaultProps = {
  fadeInCounter: null,
  item: null,
  publishers: null,
  referenceData: null
};

SearchHitItem.propTypes = {
  fadeInCounter: PropTypes.number,
  item: PropTypes.shape({}),
  publishers: PropTypes.object,
  referenceData: PropTypes.object
};
