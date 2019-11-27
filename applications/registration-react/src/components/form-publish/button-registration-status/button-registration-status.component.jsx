import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Button } from 'reactstrap';

const handleChange = (onChange, registrationStatus) => {
  onChange(registrationStatus);
};

export const ButtonRegistrationStatus = ({ onChange, published }) => {
  if (!published) {
    return (
      <Button
        id="dataset-setPublish-button"
        className="fdk-button mr-3"
        color="primary"
        onClick={() => handleChange(onChange, 'PUBLISH')}
      >
        Publiser
      </Button>
    );
  }
  return (
    <Button
      id="dataset-setDraft-button"
      className="fdk-button shadow-none bg-transparent btn-outline-primary mr-3"
      onClick={() => handleChange(onChange, 'DRAFT')}
    >
      Avpubliser
    </Button>
  );
};

ButtonRegistrationStatus.defaultProps = {
  onChange: noop(),
  published: false
};

ButtonRegistrationStatus.propTypes = {
  onChange: PropTypes.func,
  published: PropTypes.bool
};
