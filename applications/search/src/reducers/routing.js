import { LOCATION_CHANGE } from 'react-router-redux';
import { DATASETS_REQUEST, DATASETS_SUCCESS, DATASETS_FAILURE } from '../constants/ActionTypes';

// This initial state is *copied* from react-router-redux's
// routerReducer (the property name 'locationBeforeTransitions' is
// because this is designed for use with react-router)
const initialState = { locationBeforeTransitions: null };

export default function routing(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      console.log("i routing LOCATION_CHANGE");
      return { ...state, locationBeforeTransitions: action.payload }
    case DATASETS_SUCCESS:
      console.log("i routing DATASETS_SUCCESS");
      let location = state.locationBeforeTransitions;
      const pathname = `/reports`;
      location = { ...location, pathname, action: 'PUSH' };
      return {
        ...state,
        locationBeforeTransitions: location
      };
    default:
      return state;
  }
}
