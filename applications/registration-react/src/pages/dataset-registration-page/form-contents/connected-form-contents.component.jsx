import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import { ConfiguredFormTitle } from './configured-form-contents';
import {
  conformsToType,
  relevanceAnnotationType,
  completenessAnnotationType,
  accuracyAnnotationType,
  availabilityAnnotationType
} from '../../../schemaTypes';

const mapStateToProps = ({ state }, { datasetItem = {} }) => {
  const {
    conformsTo = [conformsToType],
    hasRelevanceAnnotation = relevanceAnnotationType,
    hasCompletenessAnnotation = completenessAnnotationType,
    hasAccuracyAnnotation = accuracyAnnotationType,
    hasAvailabilityAnnotation = availabilityAnnotationType
  } = datasetItem;

  return {
    initialValues: {
      conformsTo,
      hasRelevanceAnnotation,
      hasCompletenessAnnotation,
      hasAccuracyAnnotation,
      hasAvailabilityAnnotation
    },
    syncErrors: getFormSyncErrors('contents')(state)
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export const ConnectedFormContents = connect(
  mapStateToProps,
  null,
  mergeProps
)(ConfiguredFormTitle);
