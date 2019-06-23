import { compose } from 'recompose';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';

export const AUTH_INIT = 'AUTH_INIT';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

export const selectAuthState = state => state.auth;

export const selectUser = compose(
  authState => authState.user,
  selectAuthState
);

export const selectIsAuthenticating = compose(
  authState => !!authState.isAuthenticating,
  selectAuthState
);

export const authenticateThunk = () => (dispatch, getState) =>
  !selectIsAuthenticating(getState()) &&
  dispatch(
    reduxFsaThunk(
      () =>
        fetch('/innloggetBruker', {
          method: 'GET',
          headers: { Accept: 'application/json' }
        }).then(r => r.json()),
      {
        onBeforeStart: { type: AUTH_INIT },
        onSuccess: { type: AUTH_SUCCESS },
        onError: { type: AUTH_ERROR }
      }
    )
  );

export const logoutThunk = () => dispatch => dispatch({ type: AUTH_LOGOUT });

const initialState = {
  user: undefined,
  isAuthenticating: undefined,
  error: undefined
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_INIT:
      return {
        ...state, // do not remove current user while waiting for new, but clear error
        isAuthenticating: true,
        error: undefined
      };
    case AUTH_SUCCESS:
      return {
        user: action.payload
      };
    case AUTH_ERROR:
      return {
        error: action.payload
      };
    case AUTH_LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}
