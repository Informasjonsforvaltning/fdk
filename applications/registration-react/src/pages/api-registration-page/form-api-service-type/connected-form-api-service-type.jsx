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
  const { apiItem } = ownProps;
  const apiServiceTypeCodeFromForm = selector(state, 'statusCode');
  return {
    syncErrors: getFormSyncErrors('apiServiceType')(state.form),
    initialValues: {
      statusCode: _.get(apiItem, 'statusCode'),
      deprecationInfoExpirationDate: _.get(
        apiItem,
        'deprecationInfoExpirationDate'
      ),
      deprecationInfoMessage: _.get(apiItem, 'deprecationInfoMessage'),
      deprecationInfoReplacedWithUrl: _.get(
        apiItem,
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
