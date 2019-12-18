import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'reactstrap';
import { withState, withHandlers, compose } from 'recompose';

import localization from '../../../services/localization';
import { PanelBase } from '../../../components/panel-base/panel-base.component';
import InputField from '../../../components/fields/field-input/field-input.component';
import { AlertMessage } from '../../../components/alert-message/alert-message.component';
import { validateURL } from '../../../validation/validation';

export const ImportLinkUploadPure = props => {
  const {
    importByLinkError,
    handleChangeUrl,
    handleLinkUpload,
    handleCancelImport,
    touched,
    error
  } = props;
  return (
    <PanelBase>
      <div className="mb-5">
        <h3>{localization.api.import.importApiSpecLink}</h3>
      </div>
      {importByLinkError && (
        <div className="mb-5">
          <AlertMessage type="danger">
            {localization.api.import.importApiSpecLinkError}
            <button
              type="button"
              className="fdk-button-small fdk-color-link"
              onClick={handleCancelImport}
            >
              {localization.api.import.toImportFile}
            </button>
          </AlertMessage>
        </div>
      )}
      <div className="mb-5">
        <InputField
          input={{
            name: 'importUrl',
            onChange: e => handleChangeUrl(e)
          }}
          showLabel
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
        className="mr-3"
        color="primary"
        onClick={handleLinkUpload}
      >
        {localization.api.import.import}
      </Button>
      <Button
        testid="button-cancel"
        className="fdk-color-link fdk-bg-color-white"
        color="transparent"
        onClick={handleCancelImport}
      >
        {localization.api.import.cancel}
      </Button>
    </PanelBase>
  );
};

ImportLinkUploadPure.defaultProps = {
  importByLinkError: false,
  touched: false,
  error: null
};

ImportLinkUploadPure.propTypes = {
  importByLinkError: PropTypes.bool,
  handleChangeUrl: PropTypes.func.isRequired,
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
      props.handleChangeUrl(e);
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

export const ImportLinkUpload = enhance(ImportLinkUploadPure);
