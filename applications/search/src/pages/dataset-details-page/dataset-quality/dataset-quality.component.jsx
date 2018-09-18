import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';
import { ListRegular } from '../../../components/list-regular/list-regular.component';
import { TwoColRow } from '../../../components/list-regular/twoColRow/twoColRow';

export const DatasetQuality = props => {
  const {
    relevanceAnnotation,
    completenessAnnotation,
    accuracyAnnotation,
    availabilityAnnotations,
    hasCurrentnessAnnotation,
    provenance
  } = props;

  if (
    !(
      relevanceAnnotation ||
      completenessAnnotation ||
      accuracyAnnotation ||
      availabilityAnnotations ||
      hasCurrentnessAnnotation ||
      provenance
    )
  ) {
    return null;
  }

  return (
    <ListRegular title={localization.dataset.quality}>
      {provenance && (
        <React.Fragment>
          <TwoColRow col1={localization.dataset.provenance} col2={provenance} />
        </React.Fragment>
      )}
      {hasCurrentnessAnnotation && (
        <React.Fragment>
          <TwoColRow
            col1={localization.dataset.currentness}
            col2={hasCurrentnessAnnotation}
          />
        </React.Fragment>
      )}
      {completenessAnnotation && (
        <React.Fragment>
          <TwoColRow
            col1={localization.dataset.completenessAnnotation}
            col2={completenessAnnotation}
          />
        </React.Fragment>
      )}
      {accuracyAnnotation && (
        <React.Fragment>
          <TwoColRow
            col1={localization.dataset.accuracyAnnotation}
            col2={accuracyAnnotation}
          />
        </React.Fragment>
      )}
      {relevanceAnnotation && (
        <React.Fragment>
          <TwoColRow
            col1={localization.dataset.relevanceAnnotation}
            col2={relevanceAnnotation}
          />
        </React.Fragment>
      )}
      {availabilityAnnotations && (
        <React.Fragment>
          <TwoColRow
            col1={localization.dataset.availabilityAnnotations}
            col2={availabilityAnnotations}
          />
        </React.Fragment>
      )}
    </ListRegular>
  );
};

DatasetQuality.defaultProps = {
  relevanceAnnotation: null,
  completenessAnnotation: null,
  accuracyAnnotation: null,
  availabilityAnnotations: null,
  hasCurrentnessAnnotation: null,
  provenance: null
};

DatasetQuality.propTypes = {
  relevanceAnnotation: PropTypes.string,
  completenessAnnotation: PropTypes.string,
  accuracyAnnotation: PropTypes.string,
  availabilityAnnotations: PropTypes.string,
  hasCurrentnessAnnotation: PropTypes.string,
  provenance: PropTypes.string
};
