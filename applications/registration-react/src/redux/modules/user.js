import { compose } from 'recompose';

export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

export const selectAuthState = state => state.user;

export const selectUser = compose(
  authState => authState.user,
  selectAuthState
);

export const userSuccessAction = ({ user }) => ({
  type: USER_SUCCESS,
  payload: user
});
export const userFailureAction = ({ error }) => ({
  type: USER_FAILURE,
  payload: error
});

const initialState = {
  user: undefined,
  error: undefined
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case USER_SUCCESS:
      return { user: action.payload };
    case USER_FAILURE:
      return { error: action.payload };
    default:
      return state;
  }
}
