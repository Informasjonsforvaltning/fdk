<<<<<<< HEAD
import { getFormSyncErrors } from 'redux-form';
=======
import { formValueSelector, getFormSyncErrors } from 'redux-form';
>>>>>>> initial commit
import { connect } from 'react-redux';
import _ from 'lodash';
import { ConfiguredFormApiServiceType } from './configured-form-api-service-type';

<<<<<<< HEAD
const mapStateToProps = (state, ownProps) => {
  const { apiItem } = ownProps;
  return {
    syncErrors: getFormSyncErrors('apiServiceType')(state.form),
    initialValues: {
      serviceType: _.get(apiItem, 'serviceType')
    }
=======
const selector = formValueSelector('apiServiceType');

const mapStateToProps = (state, ownProps) => {
  const { apiServiceTypeItems } = ownProps;
  const apiServiceTypeCodeFromForm = selector(state, 'serviceType');
  return {
    syncErrors: getFormSyncErrors('apiServiceType')(state.form),
    initialValues: {
      serviceType: _.get(apiServiceTypeItems, 'serviceType'),
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
>>>>>>> initial commit
  };
};

export const ConnectedFormApiServiceType = connect(mapStateToProps)(
  ConfiguredFormApiServiceType
);
