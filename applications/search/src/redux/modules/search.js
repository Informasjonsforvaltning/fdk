import qs from 'qs';

const SET_QUERY_QUERYSTRING = 'SET_QUERY_QUERYSTRING';
const SET_QUERY_FIELD = 'SET_QUERY_FIELD';
const SET_QUERY_FROM = 'SET_QUERY_FROM';
const CLEAR_QUERY = 'CLEAR_QUERY';

export function setSearchQuery(query, history) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_QUERY_QUERYSTRING,
      query
    });
    history.push(
      `?${qs.stringify(getState().searchQuery, { skipNulls: true })}`
    );
  };
}

export function setQueryFilter(fieldType, fieldValue, history) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_QUERY_FIELD,
      fieldType,
      fieldValue
    });
    history.push(
      `?${qs.stringify(getState().searchQuery, { skipNulls: true })}`
    );
  };
}

export function setQueryFrom(fieldValue, history) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_QUERY_FROM,
      fieldValue
    });
    history.push(
      `?${qs.stringify(getState().searchQuery, { skipNulls: true })}`
    );
  };
}

export function clearQuery(history) {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_QUERY
    });
    history.push(
      `?${qs.stringify(getState().searchQuery, { skipNulls: true })}`
    );
  };
}

const initialState = qs.parse(window.location.search, {
  ignoreQueryPrefix: true
}) || { q: undefined };

export function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SET_QUERY_QUERYSTRING:
      return { ...state, q: action.query, from: undefined };
    case SET_QUERY_FIELD:
      return {
        ...state,
        [action.fieldType]: action.fieldValue,
        from: undefined
      };
    case SET_QUERY_FROM:
      return {
        ...state,
        from: action.fieldValue
      };
    case CLEAR_QUERY:
      return {
        ...null,
        q: state.q,
        sortfield: state.sortfield
      };
    default:
      return state;
  }
}
