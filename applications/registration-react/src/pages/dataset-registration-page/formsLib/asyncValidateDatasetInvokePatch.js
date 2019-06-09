import {
  datasetFormPatchErrorAction,
  datasetFormPatchIsSavingAction,
  datasetFormPatchSuccessAction
} from '../../../redux/modules/dataset-form-status';
import { datasetSuccessAction } from '../../../redux/modules/datasets';
import { patchDataset } from '../../../api/datasets';
import { normalizeAxiosError } from '../../../lib/normalize-axios-error';

export const asyncValidateDatasetInvokePatch = (values, dispatch, props) => {
  const { catalogId, datasetId } = props;

  if (!(catalogId && datasetId)) {
    throw new Error('datasetId required');
  }

  const patch = values;

  dispatch(datasetFormPatchIsSavingAction({ datasetId }));

  return patchDataset(catalogId, datasetId, patch)
    .then(response => {
      const dataset = response && response.data;
      dispatch(datasetFormPatchSuccessAction({ datasetId, patch }));
      dispatch(datasetSuccessAction(dataset));
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
