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
      <div className="col-7">{methodDeclaration.summary}</div>
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

export const ApiEndpoints = props => {
  const { name, paths } = props;
  return (
    <section className="mb-5 list-regular" name={name}>
      <div className="d-flex list-regular--item">
        <div className="col-5 pl-0">
          <h3 className="">{localization.api.endpoints.operation}</h3>
        </div>
        <div className="col-7">
          <h3 className="">{localization.api.endpoints.summary}</h3>
        </div>
      </div>
      {renderPaths(paths)}
    </section>
  );
};

ApiEndpoints.defaultProps = {
  name: null,
  paths: null
};

ApiEndpoints.propTypes = {
  name: PropTypes.string,
  paths: PropTypes.object
};
