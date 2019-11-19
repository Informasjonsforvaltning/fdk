import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getTranslateText } from '../../lib/translateText';
import localization from '../../lib/localization';

const displayCatalogTitle = (publisherItem, catalog) => {
  if (
    catalog &&
    _.get(publisherItem, 'id') !== _.get(catalog, ['publisher', 'id'])
  ) {
    const catalogTitle = getTranslateText(_.get(catalog, ['title']));

    return ` (${localization.dataset.registeredIn} ${catalogTitle})`;
  }

  return null;
};

export const PublisherLabel = props => {
  const { label, tag: Tag, publisherItem, catalog } = props;
  if (!publisherItem) {
    return null;
  }

  const publisherPrefLabel =
    getTranslateText(_.get(publisherItem, ['prefLabel'])) ||
    _.capitalize(_.get(publisherItem, 'name', ''));

  return (
    <span className="mr-3">
      {label}&nbsp;
      <Tag>
        {publisherPrefLabel}
        {displayCatalogTitle(publisherItem, catalog)}
      </Tag>
    </span>
  );
};

PublisherLabel.defaultProps = {
  label: null,
  tag: 'span',
  publisherItem: null
};

PublisherLabel.propTypes = {
  label: PropTypes.string,
  tag: PropTypes.string,
  publisherItem: PropTypes.object
};
