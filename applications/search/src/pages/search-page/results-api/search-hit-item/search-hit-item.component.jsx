import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import localization from '../../../../lib/localization';
import './search-hit-item.scss';
import { getTranslateText } from '../../../../lib/translateText';
import { SearchHitHeader } from '../../../../components/search-hit-header/search-hit-header.component';
import { AlertMessage } from '../../../../components/alert-message/alert-message.component';

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

const renderDescription = description => {
  if (!description) {
    return null;
  }
  const descriptionText = getTranslateText(description);
  const breakPattern = /(\n|<br|<\/p|<\/h)/;
  const match = breakPattern.exec(descriptionText);

  let firstLine = match
    ? descriptionText.substr(0, match.index)
    : descriptionText;

  if (firstLine.length > 250) {
    firstLine = firstLine.substr(0, 220);
    firstLine = firstLine.substr(0, firstLine.lastIndexOf(' '));
  }

  if (firstLine.length < descriptionText.length) {
    firstLine += ' ...';
  }

  return (
    <div className="fdk-text-size-medium">
      <div className="uu-invisible" aria-hidden="false">
        Beskrivelse av api
      </div>
      {firstLine}
    </div>
  );
};

const renderExpiredOrDeprecatedVersion = item => {
  const statusCode = _.get(item, 'statusCode');
  const deprecationInfoExpirationDate = _.get(
    item,
    'deprecationInfoExpirationDate'
  );
  const deprecationInfoReplacedWithUrl = _.get(
    item,
    'deprecationInfoReplacedWithUrl'
  );
  if (statusCode === 'REMOVED') {
    return (
      <AlertMessage type="info">
        <span>{localization.statusRemoved} </span>
        {deprecationInfoReplacedWithUrl && (
          <a href={deprecationInfoReplacedWithUrl}>
            {localization.statusReplacedUrl}
          </a>
        )}
      </AlertMessage>
    );
  } else if (statusCode === 'DEPRECATED') {
    return (
      <AlertMessage type="info">
        <span>
          {deprecationInfoExpirationDate &&
            localization.formatString(
              localization.statusDeprecated,
              localization.during,
              deprecationInfoExpirationDate.substring(0, 4)
            )}
          {!deprecationInfoExpirationDate &&
            localization.formatString(localization.statusDeprecated, '', '')}
        </span>

        {deprecationInfoReplacedWithUrl && (
          <a href={deprecationInfoReplacedWithUrl}>
            {localization.statusReplacedUrl}
          </a>
        )}
      </AlertMessage>
    );
  }
  return null;
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

  const { isFree, isOpenAccess, isOpenLicense } = item;

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

      {renderExpiredOrDeprecatedVersion(item)}

      {renderDescription(_.get(item, 'description'))}

      {renderFormat(_.get(item, 'formats'))}

      {isFree === true && (
        <span className="access-icon fdk-color-green-1">
          <span className="icon2-icon-api-cost-none">
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
            <span className="path4" />
            <span className="path5" />
          </span>{' '}
          Gratis
        </span>
      )}

      {isFree === false && (
        <span className="access-icon fdk-color-red-1">
          <span className="icon2-icon-api-cost">
            <span className="path1" />
            <span className="path2" />
          </span>{' '}
          Ikke gratis å bruke
        </span>
      )}
      {isOpenAccess === true && (
        <span className="access-icon fdk-color-green-1">
          <span className="icon2-icon-api-access-all">
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
            <span className="path4" />
          </span>Åpent for alle
        </span>
      )}
      {isOpenAccess === false && (
        <span className="access-icon fdk-color-red-1">
          <span className="icon2-icon-api-access-not-limited">
            <span className="path1" />
            <span className="path2" />
          </span>Ikke åpen tilgang
        </span>
      )}
      {isOpenLicense === true && (
        <span className="access-icon fdk-color-green-1">
          <span className="icon2-icon-api-license-open">
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
            <span className="path4" />
            <span className="path5" />
            <span className="path6" />
          </span>{' '}
          Åpen lisens{' '}
        </span>
      )}
      {isOpenLicense === false && (
        <span className="access-icon fdk-color-red-1">
          <span className="icon2-icon-api-license">
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
            <span className="path4" />
            <span className="path5" />
            <span className="path6" />
          </span>{' '}
          Ikke åpen lisens{' '}
        </span>
      )}
    </article>
  );
};

SearchHitItem.defaultProps = {
  referenceData: null,
  item: {},
  publishers: null
};

SearchHitItem.propTypes = {
  item: PropTypes.shape({}),
  publishers: PropTypes.object,
  referenceData: PropTypes.object
};
