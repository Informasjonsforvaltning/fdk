import { reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import Form from './form';
import asyncValidate from '../../utils/asyncValidate';

const FormType = reduxForm({
  form: 'type',
  asyncValidate
})(
  connect(state => ({
    syncErrors: getFormSyncErrors('type')(state)
  }))(Form)
);

const mapStateToProps = ({ dataset }) => ({
  initialValues: {
    type:
      dataset.result.type && dataset.result.type.length > 0
        ? dataset.result.type
        : ''
  }
});

export default connect(mapStateToProps)(FormType);
