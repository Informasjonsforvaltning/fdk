import axios from 'axios';
import { CATALOG_SUCCESS } from '../../../redux/modules/catalog';

export const putCatalogDataset = (values, dispatch) => {
  const postURL = window.location.pathname;
  const catalogDatasetsURL = postURL.substring(0, postURL.lastIndexOf('/'));

  return axios
    .put(catalogDatasetsURL, values)
    .then(r => r.data)
    .then(payload =>
      dispatch({
        type: CATALOG_SUCCESS,
        meta: { catalogId: payload.id },
        payload
      })
    )
    .catch(response => {
      const { error } = response;
      return Promise.reject(error);
    });
};
