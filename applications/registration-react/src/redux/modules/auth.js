import { compose } from 'recompose';
import { fetchActions } from '../fetchActions';
import * as actions from '../../constants/ActionTypes';

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

export function authenticateAction() {
  return (dispatch, getState) =>
    // eslint-disable-next-line no-use-before-define
    !selectIsAuthenticating(getState()) &&
    dispatch(
      fetchActions('/innloggetBruker', [
        USER_REQUEST,
        USER_SUCCESS,
        USER_FAILURE
      ])
    );
}

export function logoutAction() {
  return dispatch =>
    dispatch({
      type: actions.USER_FAILURE
    });
}

const initialState = {};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case USER_REQUEST:
      return {
        ...state,
        isAuthenticating: true
      };
    case USER_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        user: action.payload
      };
    case USER_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        user: null
      };
    default:
      return state;
  }
}

export const selectAuthState = state => state.auth;

export const selectUser = compose(
  authState => authState.user,
  selectAuthState
);

export const selectIsAuthenticating = compose(
  authState => !!authState.isAuthenticating,
  selectAuthState
);
