import _ from 'lodash';
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
  fieldValues.remove(indexToRemove);
  const values = fieldValues.getAll();
  values.splice(indexToRemove, 1);
  const body = {
    [valueKey]: values
  };

  if (typeof dispatch !== 'function') {
    throw new Error('dispatch must be a function');
  }

  if (datasetId) {
    dispatch(datasetFormPatchIsSavingAction(datasetId));
  }

  return patchDataset(catalogId, datasetId, body)
    .then(response => {
      dispatch(
        datasetFormPatchSuccessAction(
          _.get(response, ['data', 'id']),
          _.get(response, ['data', '_lastModified'])
        )
      );
      dispatch(datasetSuccessAction(response));
    })
    .catch(error =>
      dispatch(
        datasetFormPatchErrorAction(datasetId, normalizeAxiosError(error))
      )
    );
};
