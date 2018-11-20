import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { LabelNational } from '../label-national/label-national.component';
import { PublisherLabel } from '../publisher-label/publisher-label.component';
import { getPublisherByOrgNr } from '../../redux/modules/publishers';
import { getTranslateText } from '../../lib/translateText';
import localization from '../../lib/localization';
import './search-hit-header.scss';

const renderPublisher = (publisherLabel, publisher, publisherItems) => {
  if (!publisher) {
    return null;
  }
  const publisherItem =
    getPublisherByOrgNr(publisherItems, _.get(publisher, 'id')) || publisher;
  return (
    <PublisherLabel label={publisherLabel} publisherItem={publisherItem} />
  );
};

const renderThemes = theme => {
  let themeNodes;
  if (theme) {
    themeNodes = theme.map((singleTheme, index) => (
      <div
        key={`dataset-description-theme-${index}`}
        className="fdk-label mr-2 mb-2"
      >
        <span className="uu-invisible" aria-hidden="false">
          Datasettets tema.
        </span>
        {getTranslateText(singleTheme.title)}
      </div>
    ));
  }
  return themeNodes;
};

const renderTitle = (Tag, title, titleLink) => {
  const titleTag = (Tag, title) => (
    <React.Fragment>
      <Tag className="mr-3" name={title}>
        {title}
      </Tag>
    </React.Fragment>
  );
  if (titleLink) {
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
    publisherLabel,
    publisher,
    publisherTag,
    publisherItems,
    theme,
    nationalComponent
  } = props;

  return (
    <React.Fragment>
      {title && (
        <div className="mb-2 d-flex flex-wrap align-items-baseline">
          {renderTitle(Tag, title, titleLink)}
          {nationalComponent && <LabelNational />}
        </div>
      )}

      {publisherItems && (
        <div className="mb-4">
          {renderPublisher(publisherLabel, publisher, publisherItems)}
        </div>
      )}

      <div className="mb-4">
        {!publisherItems &&
          publisher && (
            <PublisherLabel tag={publisherTag} label={publisherLabel} publisherItem={publisher} />
          )}
      </div>

      {theme && <div className="mb-4">{renderThemes(theme)}</div>}
    </React.Fragment>
  );
};

SearchHitHeader.defaultProps = {
  tag: 'h1',
  title: null,
  titleLink: null,
  publisherLabel: null,
  publisher: null,
  publisherTag:'strong',
  publisherItems: null,
  theme: null,
  nationalComponent: false
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
  nationalComponent: PropTypes.bool
};
