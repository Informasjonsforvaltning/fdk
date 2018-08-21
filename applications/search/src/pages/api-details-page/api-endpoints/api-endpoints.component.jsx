import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';

export const renderPathMethod = (path, method, methodDeclaration) => (
  <React.Fragment key={`${method}-${path}`}>
    <div className="row">
      <div className="col-5">
        {method} {path}
      </div>
      <div className="col-7">{methodDeclaration.description}</div>
    </div>
    <hr />
  </React.Fragment>
);

export const renderPath = (path, declaration) =>
  declaration &&
  Object.keys(declaration).map(method =>
    renderPathMethod(path, method, declaration[method])
  );

export const renderPaths = paths => {
  const renderedMethods =
    paths && Object.keys(paths).map(path => renderPath(path, paths[path]));
  return <div>{renderedMethods}</div>;
};

export const ApiEndpoints = props => {
  const { name, paths } = props;
  return (
    <section className="mb-5 list-type1" name={name}>
      <div className="row">
        <div className="col-5">
          <h3 className="">{localization.api.endpoints.response}</h3>
        </div>
        <div className="col-7">
          <h3 className="">{localization.api.endpoints.description}</h3>
        </div>
      </div>
      <hr />
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
