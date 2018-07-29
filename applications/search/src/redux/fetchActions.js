import { RSAA } from 'redux-api-middleware';

export function fetchActions(url, types) {
  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      types
    }
  };
}
