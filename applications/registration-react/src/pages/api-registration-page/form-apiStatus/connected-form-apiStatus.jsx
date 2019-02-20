import { formValueSelector, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ConfiguredFormApiStatus } from './configured-form-apiStatus';

const selector = formValueSelector('apiStatus');

const mapStateToProps = (state, ownProps) => {
  const { apiItem } = ownProps;
  const apiStatusCodeFromForm = selector(state, 'statusCode');
  return {
    syncErrors: getFormSyncErrors('apiStatus')(state.form),
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
    apiStatusCodeFromForm
  };
};

export const ConnectedFormApiStatus = connect(mapStateToProps)(
  ConfiguredFormApiStatus
);
