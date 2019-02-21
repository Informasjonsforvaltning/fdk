import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import { getTranslateText } from '../../lib/translateText';
import { getApiStatusByCode } from '../../redux/modules/referenceData';

export const LabelStatus = ({ tag: Tag, statusCode, referenceData }) => {
  if (statusCode === 'STABLE' || !referenceData) {
    return null;
  }
  const labelClass = cx({
    'fdk-color-dark-1':
      statusCode.toUpperCase() === 'DEPRECATED' ||
      statusCode.toUpperCase() === 'EXPERIMENTAL',
    'fdk-color-red': statusCode.toUpperCase() === 'REMOVED'
  });

  const apiStatusLabel = getTranslateText(
    _.get(getApiStatusByCode(referenceData, statusCode), 'prefLabel')
  );

  return (
    <Tag className={labelClass}>
      ({apiStatusLabel ? apiStatusLabel.toLowerCase() : null})
    </Tag>
  );
};

LabelStatus.defaultProps = {
  tag: 'h3',
  referenceData: null
};

LabelStatus.propTypes = {
  tag: PropTypes.string,
  statusCode: PropTypes.oneOf([
    'STABLE',
    'DEPRECATED',
    'EXPERIMENTAL',
    'REMOVED'
  ]).isRequired,
  referenceData: PropTypes.object
};
