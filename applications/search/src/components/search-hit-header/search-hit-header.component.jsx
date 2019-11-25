import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { LabelStatus } from '../label-status/label-status.component';
import { PublisherLabel } from '../publisher-label/publisher-label.component';
import { getPublisherByOrgNr } from '../../redux/modules/publishers';
import { getLosStructure } from '../../redux/modules/referenceData';
import { getTranslateText } from '../../lib/translateText';
import localization from '../../lib/localization';
import './search-hit-header.scss';
import { LabelNational } from '../label-national/label-national.component';
import { LinkExternal } from '../link-external/link-external.component';
import { getConfig } from '../../config';

const renderPublisher = (
  publisherLabel,
  publisher,
  publisherItems,
  catalog
) => {
  if (!publisher) {
    return null;
  }
  const publisherItem =
    getPublisherByOrgNr(publisherItems, _.get(publisher, 'id')) || publisher;
  return (
    <PublisherLabel
      label={publisherLabel}
      publisherItem={publisherItem}
      catalog={catalog}
    />
  );
};

const renderThemes = (themes, losItems, darkThemeBackground) => {
  const themeClass = cx('align-self-center mr-2 mb-2', {
    'fdk-label': !darkThemeBackground,
    'fdk-label-details': darkThemeBackground
  });

  return themes
    .map((singleTheme, index) => {
      const losItem = _.find(losItems, { uri: singleTheme.id });
      const title = getTranslateText(
        _.get(losItem, 'prefLabel') || singleTheme.title
      );
      return (
        title && (
          <div
            key={`dataset-description-theme-${index}`}
            className={themeClass}
          >
            <span className="uu-invisible" aria-hidden="false">
              Datasettets tema.
            </span>
            {title}
          </div>
        )
      );
    })
    .filter(Boolean);
};

const renderTitle = (Tag, title, titleLink, externalLink) => {
  const titleTag = (Tag, title) => (
    <Tag className="mr-3" name={title}>
      {title}
    </Tag>
  );
  if (titleLink) {
    if (externalLink) {
      return (
        <LinkExternal
          uri={getConfig().searchHost.host.concat(titleLink)}
          prefLabel={title}
        />
      );
    }
    return (
      <Link
        className="search-hit__title-link"
        title={`${localization.apiLabel}: ${title}`}
        to={titleLink}
      >
        {titleTag(Tag, title)}
      </Link>
    );
  }
  return titleTag(Tag, title);
};

export const SearchHitHeader = props => {
  const {
    tag: Tag,
    title,
    titleLink,
    catalog,
    publisherLabel,
    publisher,
    publisherTag,
    publisherItems,
    theme: themes = [],
    nationalComponent,
    statusCode,
    referenceData,
    darkThemeBackground,
    externalLink
  } = props;

  const losItems = getLosStructure(referenceData);
  return (
    <>
      {title && (
        <div className="mb-2 d-flex flex-wrap align-items-center">
          {renderTitle(Tag, title, titleLink, externalLink)}
          {statusCode && (
            <LabelStatus
              statusCode={statusCode}
              referenceData={referenceData}
            />
          )}
        </div>
      )}

      <div className="mb-4 d-flex flex-wrap align-items-baseline">
        {publisherItems &&
          renderPublisher(publisherLabel, publisher, publisherItems, catalog)}

        {!publisherItems && publisher && (
          <PublisherLabel
            tag={publisherTag}
            label={publisherLabel}
            publisherItem={publisher}
            catalog={catalog}
          />
        )}
      </div>

      {(nationalComponent || !!themes.length) && (
        <div className="mb-4 d-flex flex-wrap align-items-baseline align-items-center">
          {nationalComponent && <LabelNational />}
          {renderThemes(themes, losItems, darkThemeBackground)}
        </div>
      )}
    </>
  );
};

SearchHitHeader.defaultProps = {
  tag: 'h1',
  title: null,
  titleLink: null,
  publisherLabel: null,
  publisher: null,
  publisherTag: 'span',
  publisherItems: null,
  theme: [],
  nationalComponent: false,
  statusCode: null,
  referenceData: null,
  darkThemeBackground: false,
  externalLink: false
};

SearchHitHeader.propTypes = {
  tag: PropTypes.string,
  title: PropTypes.string,
  titleLink: PropTypes.string,
  publisherLabel: PropTypes.string,
  publisher: PropTypes.object,
  publisherTag: PropTypes.string,
  publisherItems: PropTypes.object,
  theme: PropTypes.array,
  nationalComponent: PropTypes.bool,
  statusCode: PropTypes.string,
  referenceData: PropTypes.object,
  darkThemeBackground: PropTypes.bool,
  externalLink: PropTypes.bool
};
