import axios from 'axios';
import { datasetLastSaved } from '../actions';

/* eslint-disable no-param-reassign */
const asyncValidate = (values, dispatch, props, blurredField) => {
  const postURL = window.location.pathname;

  const api = {
    Authorization: `Basic user:password`
  };

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

  return axios
    .patch(postURL, values, { headers: api })
    .then(response => {
      if (dispatch) {
        dispatch(datasetLastSaved(response.data._lastModified));
      }
    })
    .catch(response => {
      const { error } = response;
      return Promise.reject(error);
    });
};
/* eslint-enable no-param-reassign */

export default asyncValidate;
