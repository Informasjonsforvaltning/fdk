import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { LabelNational } from '../label-national/label-national.component';
import { PublisherLabel } from '../publisher-label/publisher-label.component';
import { getPublisherByOrgNr } from '../../redux/modules/publishers';
import { getTranslateText } from '../../lib/translateText';
import localization from '../../lib/localization';

const renderPublisher = (publisherLabel, publisher, publisherItems) => {
  if (!publisher) {
    return null;
  }
  const publisherItem = getPublisherByOrgNr(
    publisherItems,
    _.get(publisher, 'id')
  );

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

const renderTitle = (headerTag, title, titleLink) => {
  const titleTag = (headerTag, title) => (
    <React.Fragment>
      {headerTag === 'h1' && <h1 className="mr-3">{title}</h1>}
      {headerTag === 'h2' && <h2 className="mr-3">{title}</h2>}
    </React.Fragment>
  );
  if (title && titleLink) {
    return (
      <Link
        className="search-hit__title-link"
        title={`${localization.api}: ${getTranslateText(title)}`}
        to={titleLink}
      >
        {titleTag(headerTag, title)}
      </Link>
    );
  }
  return titleTag(headerTag, title);
};

export const SearchHitHeader = props => {
  const {
    headerTag,
    title,
    titleLink,
    publisherLabel,
    publisher,
    publisherItems,
    theme,
    provenance
  } = props;

  return (
    <React.Fragment>
      {title && (
        <div className="mb-2 d-flex flex-wrap align-items-baseline">
          {renderTitle(headerTag, title, titleLink)}
          {_.get(provenance, 'code') === 'NASJONAL' && <LabelNational />}
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
            <PublisherLabel label={publisherLabel} publisherItem={publisher} />
          )}

        {theme && renderThemes(theme)}
      </div>
    </React.Fragment>
  );
};

SearchHitHeader.defaultProps = {
  headerTag: 'h1',
  title: null,
  titleLink: null,
  publisherLabel: null,
  publisher: null,
  publisherItems: null,
  theme: null,
  provenance: null
};

SearchHitHeader.propTypes = {
  headerTag: PropTypes.string,
  title: PropTypes.string,
  titleLink: PropTypes.string,
  publisherLabel: PropTypes.string,
  publisher: PropTypes.object,
  publisherItems: PropTypes.object,
  theme: PropTypes.array,
  provenance: PropTypes.object
};
