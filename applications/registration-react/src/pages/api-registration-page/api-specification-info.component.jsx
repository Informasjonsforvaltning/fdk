/* eslint-disable  react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'reactstrap';

import localization from '../../services/localization';
import { ListRegular } from '../../components/list-regular/list-regular.component';
import { ListRegularItem } from '../../components/list-regular/list-regular-item/list-regular-item.component';
import { ImportDialog } from './import-dialog/import-dialog.component';
import { convertToSanitizedHtml } from '../../lib/markdown-converter';

export const APISpecificationInfo = ({
  info,
  paths,
  fromApiCatalog,
  showImportSpecificationButtons,
  handleShowImportSpecificationButtons,
  catalogId,
  apiId,
  handleShowImportError,
  handleShowImportSuccess,
  apiSuccess
}) => {
  if (!info) {
    return null;
  }

  return (
    <ListRegular
      title={localization.api.register.importFromSpec}
      subTitle={localization.api.register.importFromSpecSub}
    >
      {_.get(info, 'title') && (
        <ListRegularItem
          asideContent={localization.title}
          mainContent={_.get(info, 'title')}
        />
      )}
      {_.get(info, 'description') && (
        <ListRegularItem
          asideContent={localization.description}
          mainContent={
            <div
              dangerouslySetInnerHTML={{
                __html: convertToSanitizedHtml(info.description)
              }}
            />
          }
        />
      )}
      {_.get(info, 'version') && (
        <ListRegularItem
          asideContent={localization.version}
          mainContent={_.get(info, 'version')}
        />
      )}
      {paths && (
        <ListRegularItem
          asideContent={localization.operations}
          mainContent={`${Object.keys(paths).length} ${
            Object.keys(paths).length > 0
              ? localization.operations.toLowerCase()
              : localization.operation.toLowerCase()
          }`}
        />
      )}
      {_.get(info, ['license', 'url']) && (
        <div className="d-flex list-regular--item">
          <div className="col-4 pl-0 fdk-text-strong">
            {localization.license}
          </div>
          <div className="col-8">
            <a href={_.get(info, ['license', 'url'])}>
              {_.get(info, ['license', 'name'])}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          </div>
        </div>
      )}
      {_.get(info, 'termsOfService') && (
        <div className="d-flex list-regular--item">
          <div className="col-4 pl-0 fdk-text-strong">
            {localization.termsOfService}
          </div>
          <div className="col-8">
            <a href={_.get(info, 'termsOfService')}>
              {_.get(info, 'termsOfService')}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          </div>
        </div>
      )}
      {_.get(info, 'contact') && (
        <div className="d-flex list-regular--item">
          <div className="col-4 pl-0 fdk-text-strong">
            {localization.contactInformation}
          </div>
          <div className="col-8">
            <span>{_.get(info, ['contact', 'name'])}, </span>
            <span>{_.get(info, ['contact', 'url'])}, </span>
            <span>{_.get(info, ['contact', 'email'])}, </span>
          </div>
        </div>
      )}

      {!fromApiCatalog && (
        <div className="d-flex list-regular--item">
          <div className="col-12 pl-0 fdk-text-strong">
            {!showImportSpecificationButtons && (
              <Button
                className="mr-3 fdk-button"
                color="outline-primary"
                onClick={handleShowImportSpecificationButtons}
              >
                {_.capitalize(localization.getNew)} {localization.specification}
              </Button>
            )}
            {showImportSpecificationButtons && (
              <div>
                <ImportDialog
                  catalogId={catalogId}
                  apiId={apiId}
                  handleShowImportSpecificationButtons={
                    handleShowImportSpecificationButtons
                  }
                  handleShowImportError={handleShowImportError}
                  handleShowImportSuccess={handleShowImportSuccess}
                  apiSuccess={apiSuccess}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </ListRegular>
  );
};

APISpecificationInfo.defaultProps = {
  info: null,
  paths: null,
  fromApiCatalog: false,
  showImportSpecificationButtons: false,
  handleShowImportSpecificationButtons: _.noop,
  catalogId: null,
  apiId: null,
  handleShowImportError: _.noop,
  handleShowImportSuccess: _.noop,
  apiSuccess: _.noop
};

APISpecificationInfo.propTypes = {
  info: PropTypes.object,
  paths: PropTypes.object,
  fromApiCatalog: PropTypes.bool,
  showImportSpecificationButtons: PropTypes.bool,
  handleShowImportSpecificationButtons: PropTypes.func,
  catalogId: PropTypes.string,
  apiId: PropTypes.string,
  handleShowImportError: PropTypes.func,
  handleShowImportSuccess: PropTypes.func,
  apiSuccess: PropTypes.func
};
