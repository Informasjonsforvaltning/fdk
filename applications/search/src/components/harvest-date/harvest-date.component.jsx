import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import localization from '../../lib/localization';

const renderHarvested = harvest => {
  if (harvest && harvest.firstHarvested) {
    return (
      <span>
        {localization.dataset.firstHarvested}&nbsp;
        <Moment format="DD.MM.YYYY">{harvest.firstHarvested}</Moment>
      </span>
    );
  }
  return null;
};

const renderHarvestSeparator = harvest => {
  if (harvest && harvest.firstHarvested && harvest.lastChanged) {
    return <span>&nbsp;/&nbsp;</span>;
  }
  return null;
};

const renderLastChanged = harvest => {
  if (harvest && harvest.lastChanged) {
    return (
      <span>
        {localization.dataset.lastChanged}&nbsp;
        <Moment format="DD.MM.YYYY">{harvest.lastChanged}</Moment>
      </span>
    );
  }
  return null;
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
