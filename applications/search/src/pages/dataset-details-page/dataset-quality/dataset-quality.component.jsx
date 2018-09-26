import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';

export const DatasetQuality = props => {
  const {
    relevanceAnnotation,
    completenessAnnotation,
    accuracyAnnotation,
    availabilityAnnotations
  } = props;
  return (
    <section>
      <div className="fdk-container-detail fdk-container-detail-header">
        <i className="fa fa-star fdk-fa-left fdk-color-cta" />
        {localization.dataset.quality}
      </div>

      <div className="fdk-container-detail">
        {relevanceAnnotation && (
          <div>
            <h5>{localization.dataset.relevanceAnnotation}</h5>
            <p className="fdk-ingress mb-5">{relevanceAnnotation}</p>
          </div>
        )}

        {completenessAnnotation && (
          <div>
            <h5>{localization.dataset.completenessAnnotation}</h5>
            <p className="fdk-ingress mb-5">{completenessAnnotation}</p>
          </div>
        )}

        {accuracyAnnotation && (
          <div>
            <h5>{localization.dataset.accuracyAnnotation}</h5>
            <p className="fdk-ingress mb-5">{accuracyAnnotation}</p>
          </div>
        )}

        {availabilityAnnotations && (
          <div>
            <h5>{localization.dataset.availabilityAnnotations}</h5>
            <p className="fdk-ingress mb-5">{availabilityAnnotations}</p>
          </div>
        )}
      </div>
    </section>
  );
};

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
