import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../components/localization';

export default class DatasetQuality extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <div className="fdk-container-detail fdk-container-detail-header">
          <i className="fa fa-star fdk-fa-left fdk-color-cta" />
          {localization.dataset.quality}
        </div>

        <div className="fdk-container-detail">

          {this.props.relevanceAnnotation &&
          <div>
            <h5>{localization.dataset.relevanceAnnotation}</h5>
            <p className="fdk-ingress fdk-margin-bottom-double">
              {this.props.relevanceAnnotation}
            </p>
          </div>
          }

          {this.props.completenessAnnotation &&
          <div>
            <h5>{localization.dataset.completenessAnnotation}</h5>
            <p className="fdk-ingress fdk-margin-bottom-double">
              {this.props.completenessAnnotation}
            </p>
          </div>
          }

          {this.props.accuracyAnnotation &&
          <div>
            <h5>{localization.dataset.accuracyAnnotation}</h5>
            <p className="fdk-ingress fdk-margin-bottom-double">
              {this.props.accuracyAnnotation}
            </p>
          </div>
          }

          {this.props.availabilityAnnotations &&
          <div>
            <h5>{localization.dataset.availabilityAnnotations}</h5>
            <p className="fdk-ingress fdk-margin-bottom-double">
              {this.props.availabilityAnnotations}
            </p>
          </div>
          }
        </div>
      </div>
    );
  }
}

DatasetQuality.defaultProps = {
  relevanceAnnotation: null,
  completenessAnnotation: null,
  accuracyAnnotation: null,
  availabilityAnnotations: null
};

DatasetQuality.propTypes = {
  relevanceAnnotation: PropTypes.string,
  completenessAnnotation: PropTypes.string,
  accuracyAnnotation: PropTypes.string,
  availabilityAnnotations: PropTypes.string
};
