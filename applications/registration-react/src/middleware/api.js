// import fetch from 'isomorphic-fetch';
import axios from 'axios';

function callApi2(url) {
  const getHeaders = new Headers();
  getHeaders.append('pragma', 'no-cache');
  getHeaders.append('cache-control', 'no-cache');

  const getInit = {
    method: 'GET',
    headers: getHeaders,
    credentials: 'same-origin'
  };

  return fetch(url, getInit)
    .then(response => response.json())
    .then((response) => {
      const { error } = response;
      if (error) return Promise.reject(error);
      return { ...response };
    });
}

function callApi(url) {

  return axios.get(url)
    .then((response) => response)
    .catch((response) => {
      const { error } = response;
      return Promise.reject(error);
    })
}

export const CALL_API = 'CALL_API';

export default () => next => (action) => {
  const callApiOptions = action[CALL_API];

  if (typeof callApiOptions === 'undefined') {
    return next(action);
  }

  const { types } = callApiOptions;
  const [requestType, successType, failureType] = types;
  const url = callApiOptions.url;

  function actionWith(data) {
    const finalAction = { ...action, ...data };
    delete finalAction[CALL_API];
    return finalAction;
  }

  next(actionWith({ type: requestType }));

  return callApi(url)
    .then(response => next(actionWith({
      type: successType,
      response
    })))
    .catch(error => next(actionWith({
      type: failureType,
      error
    })));
};
