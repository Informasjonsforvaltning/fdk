import axios from 'axios';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const asyncValidate = (values, dispatch, props, blurredField) => {
  console.log("asyncvalidate values", JSON.stringify(values));
  const postURL = window.location.pathname.substr(6);

  // TODO må enten bare lagre et og et felt (ikke ønskelig), ønskelig å lagre alt, men utelate felt som har feil (ikke validert korrekt)
  console.log("asyncvalidate2", blurredField);

  const api = {
    Authorization: "Basic " + null
  }

  if (blurredField && blurredField.indexOf('remove_') !== -1) {
    const index = blurredField.split("_").pop();
    values.splice(index,1);
    values = {
      temporal: values
    }
  }

  const values2 = {
    /*
    title: {
      nb: "test tittel0"
    },
    description: {
      nb: 'beskrivelsee'
    },
    */
    spatial: [
      {
        uri: 'asker3',
        prefLabel: {}
      },
      {
        uri: 'os',
        prefLabel: {}
      },
      {
        uri: 'oslo',
        prefLabel: {}
      }
    ]
  }

  const values3 = {
    issued: '1514761200000'
  }

  const values4 = {
    title: {
      nb: 'test tittel123456789'
    },
    spatial: [
      {
        uri: 'asker4',
        prefLabel: {}
      }
    ],
    issued: "2018-01-20"
  }

  return axios.patch(
    // '/catalogs/910244132/datasets/e679b150-e69d-444c-bf7f-874d6999c62d/', values, {headers: api}
    postURL, values, {headers: api}
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
