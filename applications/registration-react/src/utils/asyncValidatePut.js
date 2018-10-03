import axios from 'axios';
import { datasetLastSaved } from '../actions';

const asyncValidatePut = (values, dispatch) => {
  const postURL = window.location.pathname;
  const catalogDatasetsURL = postURL.substring(0, postURL.lastIndexOf('/'));

  return axios
    .put(catalogDatasetsURL, values)
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
