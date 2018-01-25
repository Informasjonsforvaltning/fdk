import { HELPTEXTS_REQUEST, HELPTEXTS_SUCCESS, HELPTEXTS_FAILURE } from '../constants/ActionTypes';
import { normalize } from 'normalizr';
import { helptext } from '../schemas/schemas.js';

export default function dataset(state = { isFetchingHelptext: false, helptextItems: null }, action) {
  switch (action.type) {
    case HELPTEXTS_REQUEST:
      return {
        ...state,
        isFetchingHelptext: true
      };
    case HELPTEXTS_SUCCESS:
      const objFromArray = action.response.data.reduce((accumulator, current) => {
        accumulator[current.id] = current
        return accumulator
      }, {})
      return {
        ...state,
        isFetchingHelptext: false,
        helptextItems: objFromArray
      }
    case HELPTEXTS_FAILURE:
      return {
        ...state,
        isFetchingHelptext: false,
        helptextItems: null
      };
    default:
      return state;
  }
}
