import axios from 'axios';
import { datasetLastSaved } from '../actions';

const asyncValidatePut = (values, dispatch) => {
  const postURL = window.location.pathname;

  return axios
    .put(postURL, values)
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

export default asyncValidatePut;
