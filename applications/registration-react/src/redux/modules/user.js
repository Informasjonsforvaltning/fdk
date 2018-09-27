import {
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAILURE
} from '../../constants/ActionTypes';

export default function user(
  state = { isFetchingUser: false, userItem: null },
  action
) {
  switch (action.type) {
    case USER_REQUEST:
      return {
        ...state,
        isFetchingUser: true
      };
    case USER_SUCCESS:
      return {
        ...state,
        isFetchingUser: false,
        userItem: action.payload
      };
    case USER_FAILURE:
      return {
        ...state,
        isFetchingUser: false,
        userItem: null
      };
    default:
      return state;
  }
}
