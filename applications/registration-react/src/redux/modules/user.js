import { compose } from 'recompose';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';
import { authService } from '../../auth/auth-service';

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

export const selectAuthState = state => state.user;

export const selectUser = compose(
  authState => authState.user,
  selectAuthState
);

export const selectIsFetching = compose(
  authState => !!authState.isFetching,
  selectAuthState
);

export const getUserProfileThunk = () => (dispatch, getState) =>
  !selectIsFetching(getState()) &&
  dispatch(
    reduxFsaThunk(() => authService.getUserProfile(), {
      onBeforeStart: { type: USER_REQUEST },
      onSuccess: { type: USER_SUCCESS },
      onError: { type: USER_FAILURE }
    })
  );

const initialState = {
  user: undefined,
  isFetching: undefined
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case USER_REQUEST:
      return {
        // do not remove current user while waiting for new, but clear error
        user: state.user,
        isFetching: true
      };
    case USER_SUCCESS:
      return {
        user: action.payload
      };
    case USER_FAILURE:
      return initialState;
    default:
      return state;
  }
}
