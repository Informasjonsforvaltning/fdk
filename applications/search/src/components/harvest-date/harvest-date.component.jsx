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
      <Moment format="DD.MM.YYYY">{harvest.firstHarvested}</Moment>
    </span>
  );
};

const renderHarvestSeparator = harvest => {
  if (_.get(harvest, 'firstHarvested') && _.get(harvest, 'lastChanged')) {
    return (
      <span className="d-flex flex-wrap align-self-center">&nbsp;/&nbsp;</span>
    );
  }
  return null;
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
    <>
      {renderHarvested(harvest)}
      {renderHarvestSeparator(harvest)}
      {renderLastChanged(harvest)}
    </>
  );
};

HarvestDate.defaultProps = {
  harvest: null
};

HarvestDate.propTypes = {
  harvest: PropTypes.object
};
