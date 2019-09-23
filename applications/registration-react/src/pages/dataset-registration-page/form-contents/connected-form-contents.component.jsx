import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ConfiguredFormTitle } from './configured-form-contents';
import {
  conformsToType,
  relevanceAnnotationType,
  completenessAnnotationType,
  accuracyAnnotationType,
  availabilityAnnotationType
} from '../../../schemaTypes';

const mapStateToProps = ({ state }, ownProps) => {
  const { datasetItem } = ownProps;
  return {
    initialValues: {
      conformsTo:
        _.get(datasetItem, 'conformsTo', []).length > 0
          ? _.get(datasetItem, 'conformsTo')
          : [conformsToType],
      hasRelevanceAnnotation: _.get(
        datasetItem,
        'hasRelevanceAnnotation',
        relevanceAnnotationType
      ),
      hasCompletenessAnnotation: _.get(
        datasetItem,
        'hasCompletenessAnnotation',
        completenessAnnotationType
      ),
      hasAccuracyAnnotation: _.get(
        datasetItem,
        'hasAccuracyAnnotation',
        accuracyAnnotationType
      ),
      hasAvailabilityAnnotation: _.get(
        datasetItem,
        'hasAvailabilityAnnotation',
        availabilityAnnotationType
      )
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
