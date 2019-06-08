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
    dispatch(datasetFormPatchIsSavingAction({ datasetId }));
  }

  return patchDataset(catalogId, datasetId, values)
    .then(response => {
      const datasetRegistration = response && response.data;
      dispatch(datasetFormPatchSuccessAction({ datasetId }));
      if (_.get(values, 'registrationStatus')) {
        dispatch(
          datasetFormPatchJustPublishedOrUnPublishedAction({
            datasetId,
            justChanged: true
          })
        );
      } else {
        dispatch(
          datasetFormPatchJustPublishedOrUnPublishedAction({
            datasetId,
            justChanged: false
          })
        );
      }
      dispatch(datasetSuccessAction(datasetRegistration));
    })
    .catch(error =>
      dispatch(
        datasetFormPatchErrorAction({
          datasetId,
          error: normalizeAxiosError(error)
        })
      )
    );
};
