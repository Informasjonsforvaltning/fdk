import { DATASET_LAST_SAVED } from '../../constants/ActionTypes';

export default function app(
  state = { registrationStatus: null, lastSaved: null },
  action
) {
  switch (action.type) {
    case DATASET_LAST_SAVED: {
      return {
        ...state,
        lastSaved: action.lastSaved
      };
    }
    default:
      return state;
  }
}
