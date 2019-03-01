import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import _ from 'lodash';

import localization from '../../../lib/localization';
import { PanelBase } from '../../../components/panel-base/panel-base.component';
import { InputFile } from '../../../components/input-file/input-file.component';
import { AlertMessage } from '../../../components/alert-message/alert-message.component';

export const ImportFileUpload = props => {
  const {
    fileName,
    handleFileUpload,
    handleCancelImport,
    handleShowLinkImport
  } = props;
  return (
    <PanelBase>
      <div className="mb-5">
        <h3>{localization.api.import.importApiSpecFile}</h3>
      </div>
      <div className="mb-5">
        <AlertMessage type="danger">
          {localization.api.import.importApiSpecFileError}
          <button
            className="fdk-button-small fdk-color-blue-dark"
            onClick={handleShowLinkImport}
          >
            {localization.api.import.toImportLink}
          </button>
        </AlertMessage>
      </div>
      <div className="mb-3">
        <span>{localization.api.import.filename}: </span>
        <span>{fileName}</span>
      </div>
      <InputFile
        className="btn btn-primary mr-3 mb-0"
        onChange={handleFileUpload}
      >
        {localization.api.import.importNewFile}
      </InputFile>
      <Button
        className="fdk-color-blue-dark fdk-bg-color-white"
        color="transparent"
        onClick={handleCancelImport}
      >
        {localization.api.import.cancel}
      </Button>
    </PanelBase>
  );
};

ImportFileUpload.defaultProps = {
  fileName: null,
  handleShowLinkImport: _.noop
};

ImportFileUpload.propTypes = {
  fileName: PropTypes.string,
  handleFileUpload: PropTypes.func.isRequired,
  handleCancelImport: PropTypes.func.isRequired,
  handleShowLinkImport: PropTypes.func
};
