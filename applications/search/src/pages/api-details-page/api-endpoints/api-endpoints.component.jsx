import React from 'react';
import PropTypes from 'prop-types';

export class ApiEndpoints extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  _renderPathMethod(path, method, methodDeclaration) {
    return (
      <div key={`${method}-${path}`}>
        {method} {path} {methodDeclaration.description}
      </div>
    );
  }

  _renderPath(path, declaration) {
    return (
      declaration &&
      Object.keys(declaration).map(method =>
        this._renderPathMethod(path, method, declaration[method])
      )
    );
  }

  _renderPaths() {
    const renderedMethods =
      this.props.paths &&
      Object.keys(this.props.paths).map(path =>
        this._renderPath(path, this.props.paths[path])
      );

    return (
      <div>
        <div>Endepunkt Beskrivelse</div>
        {renderedMethods}
      </div>
    );
  }

  render() {
    return (
      <section>
        <div>Endepunkt</div>
        {this._renderPaths()}
      </section>
    );
  }
}

ApiEndpoints.defaultProps = {
  paths: null
};

ApiEndpoints.propTypes = {
  paths: PropTypes.object
};
