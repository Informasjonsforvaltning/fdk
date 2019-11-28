import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Button } from 'reactstrap';
import localization from '../../../../services/localization';

const renderToggleShowValidationButton = onShowValidationError => (
  <Button
    id="dataset-setPublish-button"
    className="fdk-button mr-3"
    color="primary"
    onClick={onShowValidationError}
  >
    {localization.formStatus.publish}
  </Button>
);

export const ButtonRegistrationStatus = ({
  onChange,
  published,
  allowPublish,
  onShowValidationError
}) => {
  if (!published && allowPublish) {
    return (
      <Button
        id="dataset-setPublish-button"
        className="fdk-button mr-3"
        color="primary"
        onClick={() => onChange('PUBLISH')}
      >
        Publiser
      </Button>
    );
  }
  if (!allowPublish) {
    return renderToggleShowValidationButton(onShowValidationError);
  }
  return (
    <Button
      id="dataset-setDraft-button"
      className="fdk-button shadow-none bg-transparent btn-outline-primary mr-3"
      onClick={() => onChange('DRAFT')}
    >
      Avpubliser
    </Button>
  );
};

ButtonRegistrationStatus.defaultProps = {
  onChange: noop(),
  published: false,
  allowPublish: true,
  onShowValidationError: noop()
};

ButtonRegistrationStatus.propTypes = {
  onChange: PropTypes.func,
  published: PropTypes.bool,
  allowPublish: PropTypes.bool,
  onShowValidationError: PropTypes.func
};
