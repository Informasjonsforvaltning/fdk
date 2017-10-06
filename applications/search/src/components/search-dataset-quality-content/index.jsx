import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';

export default class DatasetQuality extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <div className="fdk-container-detail fdk-container-detail-header">
          <i className="fa fa-star fdk-fa-left fdk-color-cta" />
          {this.props.header}
        </div>
        <div className="fdk-container-detail">
          {this.props.relevans &&
          <div>
            <h5>Relevans</h5>
            <p className="fdk-ingress fdk-margin-bottom-double">
              {this.props.relevans}
            </p>
          </div>
          }

          {this.props.kompletthet &&
          <div>
            <h5>Relevans</h5>
            <p className="fdk-ingress fdk-margin-bottom-double">
              {this.props.kompletthet}
            </p>
          </div>
          }

          {this.props.noyaktighet &&
          <div>
            <h5>Relevans</h5>
            <p className="fdk-ingress fdk-margin-bottom-double">
              {this.props.noyaktighet}
            </p>
          </div>
          }

          {this.props.tilgjengelighet &&
          <div>
            <h5>Relevans</h5>
            <p className="fdk-ingress fdk-margin-bottom-double">
              {this.props.tilgjengelighet}
            </p>
          </div>
          }
        </div>
      </div>
    );
  }
}

DatasetQuality.defaultProps = {
  header: '',
  relevans: null,
  kompletthet: null,
  noyaktighet: null,
  tilgjengelighet: null
};

DatasetQuality.propTypes = {
  header: PropTypes.string,
  relevans: PropTypes.string,
  kompletthet: PropTypes.string,
  noyaktighet: PropTypes.string,
  tilgjengelighet: PropTypes.string
};
