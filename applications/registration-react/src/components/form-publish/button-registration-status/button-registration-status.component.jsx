import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'reactstrap';

const handleChange = (props, registrationStatus) => {
  const { input } = props;

  input.onChange(registrationStatus);
};

export const ButtonRegistrationStatus = props => {
  const { input } = props;
  const registrationStatus = _.get(input, 'value');
  return (
    <React.Fragment>
      {registrationStatus === 'DRAFT' && (
        <Button
          id="dataset-setPublish-button"
          className="fdk-button mr-3"
          color="primary"
          onClick={() => handleChange(props, 'PUBLISH')}
        >
          Publiser
        </Button>
      )}
      {registrationStatus === 'PUBLISH' && (
        <Button
          id="dataset-setDraft-button"
          className="fdk-button shadow-none bg-transparent btn-outline-primary mr-3"
          onClick={() => handleChange(props, 'DRAFT')}
        >
          Avpubliser
        </Button>
      )}
    </React.Fragment>
  );
};

ButtonRegistrationStatus.defaultProps = {
  input: null
};

ButtonRegistrationStatus.propTypes = {
  input: PropTypes.object
};
