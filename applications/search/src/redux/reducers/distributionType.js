import {
  DISTRIBUTIONTYPE_REQUEST,
  DISTRIBUTIONTYPE_SUCCESS,
  DISTRIBUTIONTYPE_FAILURE
} from '../ActionTypes';

export default function distributionTypes(
  state = {
    isFetchingDistributionType: false,
    distributionTypeItems: null
  },
  action
) {
  switch (action.type) {
    case DISTRIBUTIONTYPE_REQUEST: {
      return {
        ...state,
        isFetchingDistributionType: true
      };
    }
    case DISTRIBUTIONTYPE_SUCCESS: {
      return {
        ...state,
        isFetchingDistributionType: false,
        distributionTypeItems: action.response.data
      };
    }
    case DISTRIBUTIONTYPE_FAILURE: {
      return {
        ...state,
        isFetchingDistributionType: false,
        distributionTypeItems: null
      };
    }
    default:
      return state;
  }
}

export const getDistributionTypeByUri = (distributionTypeItems, uri) => {
  if (distributionTypeItems) {
    return distributionTypeItems.filter(type => type.uri === uri);
  }
  return null;
};
