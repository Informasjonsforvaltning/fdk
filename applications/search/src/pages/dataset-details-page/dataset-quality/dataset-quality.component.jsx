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
        <TwoColRow col1={localization.dataset.provenance} col2={provenance} />
      )}
      {hasCurrentnessAnnotation && (
        <TwoColRow
          col1={localization.dataset.currentness}
          col2={hasCurrentnessAnnotation}
        />
      )}
      {completenessAnnotation && (
        <TwoColRow
          col1={localization.dataset.completenessAnnotation}
          col2={completenessAnnotation}
        />
      )}
      {accuracyAnnotation && (
        <TwoColRow
          col1={localization.dataset.accuracyAnnotation}
          col2={accuracyAnnotation}
        />
      )}
      {relevanceAnnotation && (
        <TwoColRow
          col1={localization.dataset.relevanceAnnotation}
          col2={relevanceAnnotation}
        />
      )}
      {availabilityAnnotations && (
        <TwoColRow
          col1={localization.dataset.availabilityAnnotations}
          col2={availabilityAnnotations}
        />
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
