import axios from 'axios';

export const searchConcepts = ({ prefLabel, returnFields }) =>
  axios
    .get('/api/concepts', {
      params: { preflabel: prefLabel, returnFields }
    })
    .then(r => r.data);
