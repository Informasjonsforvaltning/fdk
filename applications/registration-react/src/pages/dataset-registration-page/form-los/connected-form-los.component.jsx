import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ConfiguredFormLOS } from './configured-form-los';
import { themeType } from '../../../schemaTypes';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem, losItems } = ownProps;
  return {
    initialValues: {
      theme: _.get(datasetItem, 'theme', [themeType])
    },
    losItems,
    syncErrors: getFormSyncErrors('los')(state)
  };
};

export const ConnectedFormLOS = connect(mapStateToProps)(ConfiguredFormLOS);
