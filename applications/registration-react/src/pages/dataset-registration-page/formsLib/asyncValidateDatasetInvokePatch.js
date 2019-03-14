import _ from 'lodash';
import {
  datasetFormPatchSuccessAction,
  datasetFormPatchIsSavingAction,
  datasetFormPatchErrorAction,
  datasetFormPatchJustPublishedOrUnPublishedAction
} from '../../../redux/modules/dataset-form-status';
import { datasetSuccessAction } from '../../../redux/modules/datasets';
import { patchDataset } from '../../../api/datasets';

/* eslint-disable no-param-reassign */
export const asyncValidateDatasetInvokePatch = (values, dispatch, props) => {
  const { catalogId, datasetId } = props;

  if (typeof dispatch !== 'function') {
    throw new Error('dispatch must be a function');
  }

  if (blurredField && blurredField.indexOf('remove_temporal_') !== -1) {
    const index = blurredField.split('_').pop();
    values.splice(index, 1);
    values = {
      temporal: values
    };
  } else if (
    blurredField &&
    blurredField.indexOf('remove_distribution_') !== -1
  ) {
    const index = blurredField.split('_').pop();
    values.splice(index, 1);
    values = {
      distribution: values
    };
  } else if (blurredField && blurredField.indexOf('remove_sample_') !== -1) {
    const index = blurredField.split('_').pop();
    values.splice(index, 1);
    values = {
      sample: values
    };
  } else if (
    blurredField &&
    blurredField.indexOf('remove_legalBasisForRestriction_') !== -1
  ) {
    const index = blurredField.split('_').pop();
    values.splice(index, 1);
    values = {
      legalBasisForRestriction: values
    };
  } else if (
    blurredField &&
    blurredField.indexOf('remove_legalBasisForProcessing_') !== -1
  ) {
    const index = blurredField.split('_').pop();
    values.splice(index, 1);
    values = {
      legalBasisForProcessing: values
    };
  } else if (
    blurredField &&
    blurredField.indexOf('remove_legalBasisForAccess_') !== -1
  ) {
    const index = blurredField.split('_').pop();
    values.splice(index, 1);
    values = {
      legalBasisForAccess: values
    };
  } else if (
    blurredField &&
    blurredField.indexOf('remove_references_') !== -1
  ) {
    const index = blurredField.split('_').pop();
    values.splice(index, 1);
    values = {
      references: values
    };
  }

  if (datasetId) {
    dispatch(datasetFormPatchIsSavingAction(datasetId));
  }

  return patchDataset(catalogId, datasetId, values)
    .then(response => {
      const datasetRegistration = response && response.data;
      dispatch(
        datasetFormPatchSuccessAction(
          _.get(response, ['data', 'id']),
          _.get(response, ['data', '_lastModified'])
        )
      );
      if (_.get(values, 'registrationStatus')) {
        dispatch(
          datasetFormPatchJustPublishedOrUnPublishedAction(
            _.get(response, ['data', 'id']),
            true,
            _.get(values, 'registrationStatus')
          )
        );
      } else {
        dispatch(
          datasetFormPatchJustPublishedOrUnPublishedAction(
            _.get(response, ['data', 'id']),
            false,
            _.get(response, ['data', 'registrationStatus'])
          )
        );
      }
      dispatch(datasetSuccessAction(datasetRegistration));
    })
    .catch(response => {
      const { error } = response;
      dispatch(
        datasetFormPatchErrorAction(
          datasetId,
          _.get(response, ['response', 'status'], 'network')
        )
      );
      return Promise.reject(error);
    });
};
/* eslint-enable no-param-reassign */
