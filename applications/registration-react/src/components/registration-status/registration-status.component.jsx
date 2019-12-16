import React from 'react';
import PropTypes from 'prop-types';

import './registration-status.scss';
import localization from '../../services/localization';

const getStatusIconAndLabel = registrationStatus =>
  ({
    DRAFT: {
      icon: 'icon-draft-circle-md.svg',
      label: localization.formStatus.draft
    },
    APPROVE: {
      icon: 'icon-approved-circle-md.svg',
      label: localization.formStatus.approveChecked
    },
    PUBLISH: {
      icon: 'icon-published-circle-md.svg',
      label: localization.formStatus.publishChecked
    }
  }[registrationStatus]);

export const RegistrationStatus = ({ registrationStatus }) => {
  const iconAndLabel = getStatusIconAndLabel(registrationStatus);
  return (
    <div className="fdk-registration-status">
      <img src={`/img/${iconAndLabel.icon}`} className="mr-2" alt="icon" />
      <span>{iconAndLabel.label}</span>
    </div>
  );
};

RegistrationStatus.defaultProps = {
  registrationStatus: null
};

RegistrationStatus.propTypes = {
  registrationStatus: PropTypes.string
};
