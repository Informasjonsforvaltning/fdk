import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import localization from '../../../lib/localization';
import { PanelBase } from '../../../components/panel-base/panel-base.component';
import { InputFile } from '../../../components/input-file/input-file.component';

export const ImportDialog = props => {
  const { showLinkImport, handleFileUpload } = props;
  return (
    <PanelBase>
      <div className="mb-5">
        <h3>{localization.api.import.importApiSpec}</h3>
      </div>

      <div className="mb-5">{localization.api.import.importInfo}</div>

      <Button className="mr-3" color="primary" onClick={showLinkImport}>
        {localization.api.import.importLink}
      </Button>
      <InputFile className="btn btn-primary m-0" onChange={handleFileUpload}>
        {localization.api.import.importFile}
      </InputFile>
    </PanelBase>
  );
};

ImportDialog.propTypes = {
  showLinkImport: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired
};
