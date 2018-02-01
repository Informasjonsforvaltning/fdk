import axios from 'axios';
import {
  datasetLastSaved
} from '../actions'

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const asyncValidate = (values, dispatch, props, blurredField) => {
  //const { values } = props;
  console.log("values", JSON.stringify(values));
  const postURL = window.location.pathname.substr(6);
  const api = {
    Authorization: `Basic ${  null}`
  }

  if (blurredField && blurredField.indexOf('remove_temporal_') !== -1) {
    const index = blurredField.split("_").pop();
    values.splice(index, 1);
    values = {
      temporal: values
    }
  } else if (blurredField && blurredField.indexOf('remove_distribution_') !== -1) {
    const index = blurredField.split("_").pop();
    values.splice(index, 1);
    values = {
      distribution: values
    }
  }

  return axios.patch(
    postURL, values, {headers: api}
  )
    .then((response) => {
      console.info("response", JSON.stringify(response.data._lastModified));
      dispatch(datasetLastSaved(response.data._lastModified));
    })
    .catch((error) => {
      throw {error}
    })
  ;
}

export default asyncValidate;
