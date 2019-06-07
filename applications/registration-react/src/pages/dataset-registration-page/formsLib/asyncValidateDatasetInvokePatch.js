import _ from 'lodash';
import {
  datasetFormPatchErrorAction,
  datasetFormPatchIsSavingAction,
  datasetFormPatchJustPublishedOrUnPublishedAction,
  datasetFormPatchSuccessAction
} from '../../../redux/modules/dataset-form-status';
import { datasetSuccessAction } from '../../../redux/modules/datasets';
import { patchDataset } from '../../../api/datasets';
import { normalizeAxiosError } from '../../../lib/normalize-axios-error';

export const asyncValidateDatasetInvokePatch = (values, dispatch, props) => {
  const { catalogId, datasetId } = props;

  if (typeof dispatch !== 'function') {
    throw new Error('dispatch must be a function');
  }

  if (datasetId) {
    dispatch(datasetFormPatchIsSavingAction(datasetId));
  }

  return patchDataset(catalogId, datasetId, values)
    .then(response => {
      const datasetRegistration = response && response.data;
      dispatch(datasetFormPatchSuccessAction(_.get(response, ['data', 'id'])));
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
    .catch(error =>
      dispatch(
        datasetFormPatchErrorAction(datasetId, normalizeAxiosError(error))
      )
    );
};
