import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { parse } from 'qs';

import localization from '../../utils/localization';
import { ListRegular } from '../../components/list-regular/list-regular.component';
import { ListRegularItem } from '../../components/list-regular/list-regular-item/list-regular-item.component';
import { AlertMessage } from '../../components/alert-message/alert-message.component';

const renderOpenApiInfo = (info, paths) => {
  if (!info) {
    return null;
  }

  return (
    <ListRegular title={localization.api.register.importFromSpec}>
      {_.get(info, 'title') && (
        <ListRegularItem
          asideContent={localization.title}
          mainContent={_.get(info, 'title')}
        />
      )}
      {_.get(info, 'description') && (
        <ListRegularItem
          asideContent={localization.description}
          mainContent={_.get(info, 'description')}
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
      {_.get(info, ['termsOfService', 'url']) && (
        <div className="d-flex list-regular--item">
          <div className="col-4 pl-0 fdk-text-strong">
            {localization.termsOfService}
          </div>
          <div className="col-8">
            <a href={_.get(info, ['termsOfService', 'url'])}>
              {_.get(info, ['termsOfService', 'name'])}
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
    </ListRegular>
  );
};

export const APIRegistrationPage = props => {
  const { fetchApisIfNeeded, item, location, match } = props;
  const catalogId = _.get(match, ['params', 'catalogId']);
  const searchQuery =
    parse(_.get(location, 'search'), { ignoreQueryPrefix: true }) || {};

  fetchApisIfNeeded(catalogId);

  return (
    <div className="container">
      {_.get(searchQuery, 'importSuccess') && (
        <div className="row mb-5">
          <div className="col-12">
            <AlertMessage type="success">
              {localization.api.register.importFromSpecPart1}{' '}
              {_.get(searchQuery, 'importSuccess')}{' '}
              {localization.api.register.importFromSpecPart2}
            </AlertMessage>
          </div>
        </div>
      )}
      <div className="row mb-5">
        <div className="col-12">
          {renderOpenApiInfo(
            _.get(item, ['openApi', 'info']),
            _.get(item, ['openApi', 'paths'])
          )}
        </div>
      </div>
    </div>
  );
};

APIRegistrationPage.defaultProps = {
  fetchApisIfNeeded: _.noop,
  item: null,
  location: null,
  match: null
};

APIRegistrationPage.propTypes = {
  fetchApisIfNeeded: PropTypes.func,
  item: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object
};
