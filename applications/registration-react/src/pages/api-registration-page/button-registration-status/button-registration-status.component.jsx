import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'reactstrap';

const handleChange = (props, registrationStatus) => {
  const { input } = props;

  input.onChange(registrationStatus);
};

export const ButtonRegistrationStatus = props => {
  const {
    input,
    meta: { touched, error, warning }
  } = props;
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
          className="fdk-button mr-3"
          color="info"
          onClick={() => handleChange(props, 'DRAFT')}
        >
          Avpubliser
        </Button>
      )}
      {touched &&
        ((error && <div className="alert alert-danger mt-3">{error}</div>) ||
          (warning && (
            <div className="alert alert-warning mt-3">{warning}</div>
          )))}
    </React.Fragment>
  );
};

ButtonRegistrationStatus.defaultProps = {
  input: null,
  meta: null
};

ButtonRegistrationStatus.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object
};
