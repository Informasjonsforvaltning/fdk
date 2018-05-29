import axios from 'axios';

function callApi(url) {
  /*
  const getHeaders = new Headers();
  getHeaders.append('pragma', 'no-cache');
  getHeaders.append('cache-control', 'no-cache');
  getHeaders.append('Accept', 'application/json');
  */

  const header = {
    pragma: 'no-cache',
    'cache-control': 'no-cache',
    Accept: 'application/json'
  };

  const getInit = {
    method: 'GET',
    headers: header,
    credentials: 'same-origin'
  };

  return axios
    .get(url, getInit)
    .then(response => response)
    .catch(response => {
      const { error } = response;
      return Promise.reject(error);
    });
}

export const CALL_API = 'CALL_API';

export default () => next => action => {
  const callApiOptions = action[CALL_API];

  if (typeof callApiOptions === 'undefined') {
    return next(action);
  }

  const { types } = callApiOptions;
  const [requestType, successType, failureType] = types;
  const { url } = callApiOptions;

  function actionWith(data) {
    const finalAction = { ...action, ...data };
    delete finalAction[CALL_API];
    return finalAction;
  }

  next(actionWith({ type: requestType }));

  return callApi(url)
    .then(response =>
      next(
        actionWith({
          type: successType,
          response
        })
      )
    )
    .catch(error =>
      next(
        actionWith({
          type: failureType,
          error
        })
      )
    );
};
