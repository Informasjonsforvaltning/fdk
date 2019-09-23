import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Moment from 'react-moment';
import localization from '../../lib/localization';
import './harvest-date.scss';

const renderHarvested = harvest => {
  if (!_.get(harvest, 'firstHarvested')) {
    return null;
  }
  return (
    <span className="d-flex flex-wrap align-self-center">
      {localization.dataset.firstHarvested}&nbsp;
      <Moment format="DD.MM.YYYY">{harvest.firstHarvested}</Moment>&nbsp;/&nbsp;
    </span>
  );
};

const renderLastChanged = harvest => {
  if (!_.get(harvest, 'lastChanged')) {
    return null;
  }
  return (
    <span className="d-flex flex-wrap align-self-center">
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
    <div className="d-flex flex-wrap">
      {renderHarvested(harvest)}
      {renderLastChanged(harvest)}
    </div>
  );
};

HarvestDate.defaultProps = {
  harvest: null
};

HarvestDate.propTypes = {
  harvest: PropTypes.object
};
