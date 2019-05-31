import { withProps } from 'recompose';
import _ from 'lodash';

import { distributionTypes } from './distribution-types';

const createProps = ownProps => {
  const { datasetItem } = ownProps;
  return {
    initialValues: {
      distribution: distributionTypes(_.get(datasetItem, 'distribution'))
    }
  };
};

export const setInitialValues = withProps(createProps);
