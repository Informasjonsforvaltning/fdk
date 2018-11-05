import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ConfiguredFormTitle } from './configured-form-contactPoint';
import { contactPointType } from '../../../schemaTypes';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem } = ownProps;
  return {
    initialValues: {
      contactPoint:
        _.get(datasetItem, 'contactPoint', []).length > 0
          ? _.get(datasetItem, 'contactPoint')
          : [contactPointType]
    },
    syncErrors: getFormSyncErrors('contactPoint')(state)
  };
};

export const ConnectedFormContactPoint = connect(mapStateToProps)(
  ConfiguredFormTitle
);
