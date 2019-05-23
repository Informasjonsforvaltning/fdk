import _ from 'lodash';
import {
  REFERENCEDATASETS_REQUEST,
  REFERENCEDATASETS_SUCCESS,
  REFERENCEDATASETS_FAILURE
} from '../../constants/ActionTypes';

export default function referenceDatasets(
  state = { isFetchingReferenceDatasets: false, referenceDatasetsItems: null },
  action
) {
  switch (action.type) {
    case REFERENCEDATASETS_REQUEST: {
      return {
        ...state,
        isFetchingReferenceDatasets: true
      };
    }
    case REFERENCEDATASETS_SUCCESS: {
      const referenceDatasetsItems = _.get(
        action.payload,
        ['_embedded', 'datasets'],
        []
      );
      return {
        ...state,
        isFetchingReferenceDatasets: false,
        referenceDatasetsItems
      };
    }
    case REFERENCEDATASETS_FAILURE: {
      return {
        ...state,
        isFetchingReferenceDatasets: false,
        referenceDatasetsItems: null
      };
    }
    default:
      return state;
  }
}
