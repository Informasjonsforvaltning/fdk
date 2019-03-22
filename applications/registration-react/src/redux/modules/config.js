import axios from 'axios';

export const CONFIG_SUCCESS = 'CONFIG_SUCCESS';

export function setConfigAction(config) {
  return {
    type: CONFIG_SUCCESS,
    config
  };
}

export const loadConfigFromServer = () => dispatch => {
  axios
    .get('/config.json')
    .then(response => dispatch(setConfigAction(response.data)));
};

const initialState = {
  registrationLanguage: 'nb',
  searchHostname: 'fellesdatakatalog.brreg.no'
};

export function config(state = initialState, action) {
  switch (action.type) {
    case CONFIG_SUCCESS:
      return { ...state, ...action.config };
    default:
      return state;
  }
}
