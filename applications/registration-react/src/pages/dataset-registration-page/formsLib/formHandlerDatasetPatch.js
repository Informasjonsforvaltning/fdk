import {
  datasetFormPatchErrorAction,
  datasetFormPatchIsSavingAction,
  datasetFormPatchSuccessAction
} from '../../../redux/modules/dataset-form-status';
import { datasetSuccessAction } from '../../../redux/modules/datasets';

import { patchDataset } from '../../../api/datasets';
import { normalizeAxiosError } from '../../../lib/normalize-axios-error';

export const handleDatasetDeleteFieldPatch = (
  catalogId,
  datasetId,
  valueKey,
  fieldValues,
  indexToRemove,
  dispatch
) => {
  if (!datasetId) {
    throw new Error('datasetId required');
  }

  fieldValues.remove(indexToRemove);
  const values = fieldValues.getAll();
  values.splice(indexToRemove, 1);

  const patch = { [valueKey]: values };

  dispatch(datasetFormPatchIsSavingAction({ datasetId }));

  return patchDataset(catalogId, datasetId, patch)
    .then(response => {
      dispatch(datasetFormPatchSuccessAction({ datasetId, patch }));
      dispatch(datasetSuccessAction(response));
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
