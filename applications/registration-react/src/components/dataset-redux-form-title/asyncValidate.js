import axios from 'axios';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const asyncValidate = (values, dispatch, props, blurredField) => {
  //console.log("her");
  console.log("values", JSON.stringify(values));
  // TODO må enten bare lagre et og et felt (ikke ønskelig), ønskelig å lagre alt, men utelate felt som har feil (ikke validert korrekt)
  //console.log("asyncvalidate2", blurredField);

  const api = {
    Authorization: "Basic " + null
  }

  return axios.put(
    '/catalogs/910244132/datasets/e679b150-e69d-444c-bf7f-874d6999c62d/', values, {headers: api}
  )
    .then((response) => {
      console.log("saved!");
    })
    .catch((error) => {
      console.log('feiler2');
      throw { error: error }
    })
    ;

}

export default asyncValidate;
