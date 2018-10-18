import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ConfiguredFormMeta } from './configured-form-meta';

const mapStateToProps = ({ form }, ownProps) => {
  const { apiItem } = ownProps;
  return {
    syncErrors: getFormSyncErrors('apiMeta')(form),
    initialValues: {
      cost: _.get(apiItem, 'cost', ''),
      usageLimitation: _.get(apiItem, 'usageLimitation', ''),
      performance: _.get(apiItem, 'performance', ''),
      availability: _.get(apiItem, 'availability', '')
    }
  };
};

export const ConnectedFormMeta = connect(mapStateToProps)(ConfiguredFormMeta);
