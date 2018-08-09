import React from 'react';
import PropTypes from 'prop-types';

export class ApiEndpoints extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  _renderPathMethod(path, method, methodDeclaration) {
    return (
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

    return <div>{renderedMethods}</div>;
  }

  render() {
    return (
      <section className="detailBox">
        <div className="row">
          <div className="col-5">
            <h3 className="">Endepunkt</h3>
          </div>
          <div className="col-7">
            <h3 className="">Beskrivelse</h3>
          </div>
        </div>
        <hr />

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
