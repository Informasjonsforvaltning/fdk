import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getTranslateText } from '../../lib/translateText';

export const PublisherLabel = props => {
  const { label, publisherItem } = props;
  if (!publisherItem) {
    return null;
  }

  const publisherPrefLabel =
    getTranslateText(_.get(publisherItem, ['prefLabel'])) ||
    _.capitalize(_.get(publisherItem, 'name', ''));

  return (
    <span>
      {label}&nbsp;
      <span className="fdk-strong-virksomhet">{publisherPrefLabel}</span>
    </span>
  );
};

PublisherLabel.defaultProps = {
  label: null,
  publisherItem: null
};

PublisherLabel.propTypes = {
  label: PropTypes.string,
  publisherItem: PropTypes.object
};
