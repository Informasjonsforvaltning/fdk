import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import localization from '../../../../lib/localization';
import './search-hit-item.scss';
import { getTranslateText } from '../../../../lib/translateText';
import { SearchHitHeader } from '../../../../components/search-hit-header/search-hit-header.component';
import { AlertMessage } from '../../../../components/alert-message/alert-message.component';
import {
  iconIsFree,
  iconIsNotFree,
  iconIsNotOpenAccess,
  iconIsNotOpenLicense,
  iconIsOpenAccess,
  iconIsOpenLicense
} from '../../../../components/api-icons';
import { getFirstLineOfText } from '../../../../lib/stringUtils';

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
        publisherLabel={`${localization.provider}:`}
        publisher={publisher}
        publisherItems={publishers}
        nationalComponent={item.nationalComponent}
        statusCode={item.statusCode}
        referenceData={referenceData}
        detialsPage={false}
      />
    </header>
  );
};

const renderDescription = description => {
  if (!description) {
    return null;
  }

  return (
    <div className="fdk-text-size-medium">
      <div className="uu-invisible" aria-hidden="false">
        Beskrivelse av api
      </div>
      {getFirstLineOfText(getTranslateText(description))}
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
  }
  if (statusCode === 'DEPRECATED') {
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

      <div className="access-icons mt-2 d-flex justify-content-between">
        {isFree === true && iconIsFree()}
        {isFree === false && iconIsNotFree()}
        {isOpenAccess === true && iconIsOpenAccess()}
        {isOpenAccess === false && iconIsNotOpenAccess()}
        {isOpenLicense === true && iconIsOpenLicense()}
        {isOpenLicense === false && iconIsNotOpenLicense()}
      </div>
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
