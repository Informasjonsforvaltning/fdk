import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { withState, withHandlers, compose } from 'recompose';
import _ from 'lodash';
import { readAsText } from 'promise-file-reader';

import localization from '../../../utils/localization';
import { patchApi } from '../../../api/apis';
import { InputFile } from '../../../components/input-file/input-file.component';
import { ImportLinkUpload } from '../import-link-upload/import-link-upload.component';

export const ImportDialogPure = ({
  catalogId,
  apiId,
  showLinkImport,
  onToggleShowLinkImport,
  handleShowImportSpecificationButtons,
  onSetImportUrl,
  handleShowImportError,
  handleShowImportSuccess,
  importUrl,
  apiSuccess
}) => {
  const onCancel = () => {
    handleShowImportSpecificationButtons();
    handleShowImportError(false);
  };

  const onLinkUpload = () => {
    onToggleShowLinkImport();
    handleShowImportSuccess(false);
    handleShowImportError(false);

    patchApi(catalogId, apiId, { apiSpecUrl: importUrl })
      .then(responseData => {
        apiSuccess(responseData);
        handleShowImportSuccess(true);
        handleShowImportSpecificationButtons();
      })
      .catch(error => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('error', error); // eslint-disable-line no-console
        }
        handleShowImportError(true);
      });
  };

  const onFileUpload = e => {
    handleShowImportSuccess(false);
    handleShowImportError(false);

    const fileMetaData = e.target.files[0] || null;

    if (fileMetaData) {
      readAsText(fileMetaData)
        .then(apiSpec => {
          patchApi(catalogId, apiId, { apiSpec })
            .then(responseData => {
              apiSuccess(responseData);
              handleShowImportSuccess(true);
              handleShowImportSpecificationButtons();
            })
            .catch(error => {
              if (process.env.NODE_ENV !== 'production') {
                console.log('error', error); // eslint-disable-line no-console
              }
              handleShowImportError(true);
            });
        })
        .catch(error => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('error', error); // eslint-disable-line no-console
          }
          handleShowImportError(true);
        });
    }
  };

  if (!showLinkImport) {
    return (
      <React.Fragment>
        <Button
          className="mr-3 fdk-button"
          color="primary"
          onClick={onToggleShowLinkImport}
        >
          {localization.api.import.importLink}
        </Button>
        <InputFile
          className="fdk-button btn btn-primary m-0"
          onChange={onFileUpload}
        >
          {localization.api.import.importFile}
        </InputFile>
        <Button
          testid="button-cancel"
          className="fdk-color-blue-dark fdk-bg-color-white"
          color="transparent"
          onClick={onCancel}
        >
          {localization.api.import.cancel}
        </Button>
      </React.Fragment>
    );
  }
  return (
    <ImportLinkUpload
      handleLinkUpload={onLinkUpload}
      handleCancelImport={handleShowImportSpecificationButtons}
      handleChangeImportUrl={onSetImportUrl}
    />
  );
};

ImportDialogPure.defaultProps = {
  catalogId: null,
  apiId: null,
  handleShowImportSpecificationButtons: _.noop(),
  importUrl: null,
  handleShowImportError: _.noop(),
  handleShowImportSuccess: _.noop(),
  showLinkImport: false,
  onToggleShowLinkImport: _.noop(),
  onSetImportUrl: _.noop()
};

ImportDialogPure.propTypes = {
  catalogId: PropTypes.string,
  apiId: PropTypes.string,
  handleShowImportSpecificationButtons: PropTypes.func,
  importUrl: PropTypes.string,
  handleShowImportError: PropTypes.func,
  handleShowImportSuccess: PropTypes.func,
  showLinkImport: PropTypes.bool,
  onToggleShowLinkImport: PropTypes.func,
  onSetImportUrl: PropTypes.func,
  apiSuccess: PropTypes.func.isRequired
};

const enhance = compose(
  withState('showLinkImport', 'toggleShowLinkImport', false),
  withState('importUrl', 'setImportUrl', ''),
  withHandlers({
    onToggleShowLinkImport: props => e => {
      if (e) {
        e.preventDefault();
      }
      props.toggleShowLinkImport(!props.showLinkImport);
    },
    onSetImportUrl: props => e => {
      e.preventDefault();
      props.setImportUrl(e.target.value);
    }
  })
);

export const ImportDialogPureWithState = enhance(ImportDialogPure);
export const ImportDialog = ImportDialogPureWithState;
