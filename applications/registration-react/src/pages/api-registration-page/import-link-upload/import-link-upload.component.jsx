import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'reactstrap';
import { withState, withHandlers, compose } from 'recompose';

import localization from '../../../utils/localization';
import InputField from '../../../components/field-input/field-input.component';
import { validateURL } from '../../../validation/validation';

export const ImportLinkUploadPure = props => {
  const {
    handleChangeUrl,
    handleLinkUpload,
    handleCancelImport,
    touched,
    error
  } = props;
  return (
    <div>
      <div className="mb-2">
        <InputField
          showLabel
          input={{
            name: 'importUrl',
            autoComplete: 'off',
            onChange: e => handleChangeUrl(e)
          }}
          label={localization.api.import.linkToSpec}
          type="input"
          meta={{
            touched,
            error,
            warning: null
          }}
        />
      </div>
      <Button
        testid="button-upload"
        disabled={!touched || !!error}
        className="ml-2 mr-3 fdk-button"
        color={!touched || !!error ? 'secondary' : 'primary'}
        onClick={handleLinkUpload}
      >
        {localization.api.import.import}
      </Button>
      <Button
        testid="button-cancel"
        className="fdk-color-blue-dark fdk-bg-color-white"
        color="transparent"
        onClick={handleCancelImport}
      >
        {localization.api.import.cancel}
      </Button>
    </div>
  );
};

ImportLinkUploadPure.defaultProps = {
  handleChangeUrl: _.noop(),
  touched: false,
  error: null
};

ImportLinkUploadPure.propTypes = {
  handleChangeUrl: PropTypes.func,
  handleLinkUpload: PropTypes.func.isRequired,
  handleCancelImport: PropTypes.func.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.string
};

const enhance = compose(
  withState('touched', 'setTouched', false),
  withState('error', 'setError', ''),
  withHandlers({
    handleChangeUrl: props => e => {
      props.handleChangeImportUrl(e);
      props.setTouched(true);
      const inputValue = _.get(e, ['target', 'value']);
      let errors = {};
      errors = validateURL('importUrlValidation', inputValue, errors);
      if (errors) {
        props.setError(_.get(errors, 'importUrlValidation'));
      }
    }
  })
);

export const ImportLinkUploadWithState = enhance(ImportLinkUploadPure);
export const ImportLinkUpload = ImportLinkUploadWithState;
