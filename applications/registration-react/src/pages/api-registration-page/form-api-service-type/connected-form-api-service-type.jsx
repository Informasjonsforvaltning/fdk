import { formValueSelector, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ConfiguredFormApiServiceType } from './configured-form-api-service-type';

const selector = formValueSelector('apiServiceType');

const mapStateToProps = (state, ownProps) => {
  const { apiServiceTypeItems, apiItem } = ownProps;
  const apiServiceTypeCodeFromForm = selector(state, 'serviceType');
  return {
    syncErrors: getFormSyncErrors('apiServiceType')(state.form),
    initialValues: {
      serviceType: _.get(apiItem, 'serviceType'),
      deprecationInfoExpirationDate: _.get(
        apiServiceTypeItems,
        'deprecationInfoExpirationDate'
      ),
      deprecationInfoMessage: _.get(
        apiServiceTypeItems,
        'deprecationInfoMessage'
      ),
      deprecationInfoReplacedWithUrl: _.get(
        apiServiceTypeItems,
        'deprecationInfoReplacedWithUrl'
      )
    },
    apiServiceTypeCodeFromForm
  };
};

export const ConnectedFormApiServiceType = connect(mapStateToProps)(
  ConfiguredFormApiServiceType
);
