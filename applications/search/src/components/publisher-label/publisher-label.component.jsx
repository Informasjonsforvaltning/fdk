import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getTranslateText } from '../../lib/translateText';

export const PublisherLabel = props => {
  const { label, tag: Tag, publisherItem } = props;
  if (!publisherItem) {
    return null;
  }

  const publisherPrefLabel =
    getTranslateText(_.get(publisherItem, ['prefLabel'])) ||
    _.capitalize(_.get(publisherItem, 'name', ''));

  return (
    <span className="mr-3">
      {label}&nbsp;
      <Tag>{publisherPrefLabel}</Tag>
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
