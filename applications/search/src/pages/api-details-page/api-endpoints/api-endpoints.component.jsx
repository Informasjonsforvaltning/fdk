import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import localization from '../../../lib/localization';

const allowedEndpointOperations = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace'
];

export const renderPathMethod = (path, method, methodDeclaration) => (
  <React.Fragment key={`${method}-${path}`}>
    <div className="d-flex list-regular--item">
      <div className="col-5 pl-0 fdk-text-strong">
        {method.toUpperCase()} {path}
      </div>
      <div className="col-7">{methodDeclaration.description}</div>
    </div>
  </React.Fragment>
);

export const renderPath = (path, declaration) => {
  if (!declaration) {
    return null;
  }
  // only display endpoint operations as predefined in constant
  const allowedDeclaration = _.pick(declaration, allowedEndpointOperations);

  return Object.keys(allowedDeclaration).map(method =>
    renderPathMethod(path, method, allowedDeclaration[method])
  );
};

export const renderPaths = paths => {
  const renderedMethods =
    paths && Object.keys(paths).map(path => renderPath(path, paths[path]));
  return renderedMethods;
};

const renderLinks = (apiSpecUrl, apiDocUrl) => {
  if (apiSpecUrl || apiDocUrl) {
    return (
      <div className="d-flex list-regular--item">
        <div className="col-12 pl-0">
          {apiDocUrl && (
            <a href={apiDocUrl} className="mr-5">
              {localization.documentation}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          )}
          {apiSpecUrl && (
            <a href={apiSpecUrl} className="mr-5">
              {localization.specification}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const ApiEndpoints = props => {
  const { name, paths, apiSpecUrl, apiDocUrl } = props;
  return (
    <section className="mb-5 list-regular" name={name}>
      <div className="d-flex list-regular--item">
        <div className="col-5 pl-0">
          <h3 className="">{localization.api.endpoints.operation}</h3>
        </div>
        <div className="col-7">
          <h3 className="">{localization.api.endpoints.description}</h3>
        </div>
      </div>
      {renderPaths(paths)}
      {renderLinks(apiSpecUrl, apiDocUrl)}
    </section>
  );
};

ApiEndpoints.defaultProps = {
  name: null,
  paths: null,
  apiSpecUrl: null,
  apiDocUrl: null
};

ApiEndpoints.propTypes = {
  name: PropTypes.string,
  paths: PropTypes.object,
  apiSpecUrl: PropTypes.string,
  apiDocUrl: PropTypes.string
};
