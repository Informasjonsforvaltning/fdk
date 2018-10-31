import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Moment from 'react-moment';
import localization from '../../lib/localization';

const renderHarvested = harvest => {
  if (!_.get(harvest, 'firstHarvested')) {
    return null;
  }
  return (
    <span>
      {localization.dataset.firstHarvested}&nbsp;
      <Moment format="DD.MM.YYYY">{harvest.firstHarvested}</Moment>
    </span>
  );
};

const renderHarvestSeparator = harvest => {
  if (_.get(harvest, 'firstHarvested') && _.get(harvest, 'lastChanged')) {
    return <span>&nbsp;/&nbsp;</span>;
  }
  return null;
};

const renderLastChanged = harvest => {
  if (!_.get(harvest, 'lastChanged')) {
    return null;
  }
  return (
    <span>
      {localization.dataset.lastChanged}&nbsp;
      <Moment format="DD.MM.YYYY">{_.get(harvest, 'lastChanged')}</Moment>
    </span>
  );
};

export const HarvestDate = props => {
  const { harvest } = props;
  if (!harvest) {
    return null;
  }

  return (
    <React.Fragment>
      {renderHarvested(harvest)}
      {renderHarvestSeparator(harvest)}
      {renderLastChanged(harvest)}
    </React.Fragment>
  );
};

HarvestDate.defaultProps = {
  harvest: null
};

HarvestDate.propTypes = {
  harvest: PropTypes.object
};
