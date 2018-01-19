const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const asyncValidate = (values/*, dispatch */) => {
  console.log("asyncvalidate", JSON.stringify(values));

  return sleep(1000) // simulate server latency
    .then(() => {
      if ([ 'john', 'paul', 'george', 'ringo' ].includes(values.username)) {
        throw { username: 'That username is taken' }
      }
    })

  /*
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
   console.log('feiler');
   })
   ;
   */
}

export default asyncValidate;
