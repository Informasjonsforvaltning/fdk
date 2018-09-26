import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';

import Form from './form';
import validate from './formValidations';
import asyncValidate from '../../utils/asyncValidate';

const FormSpatial = reduxForm({
  form: 'spatial',
  validate,
  asyncValidate
})(Form);

const formatTemporalUnixDatesToISO = values => {
  let temporals = null;
  if (values && values.length > 0) {
    temporals = values.map(item => ({
      startDate: item.startDate
        ? moment(item.startDate).format('YYYY-MM-DD')
        : null,
      endDate: item.endDate ? moment(item.endDate).format('YYYY-MM-DD') : null
    }));
  }
  return temporals;
};

const mapStateToProps = ({ dataset }) => ({
  initialValues: {
    spatial:
      dataset.result.spatial && dataset.result.spatial.length > 0
        ? dataset.result.spatial
        : [],
    temporal: formatTemporalUnixDatesToISO(dataset.result.temporal) || [{}],
    issued: dataset.result.issued
      ? moment(dataset.result.issued).format('YYYY-MM-DD')
      : null,
    language:
      dataset.result.language && dataset.result.language.length > 0
        ? dataset.result.language
        : []
  }
});

export default connect(mapStateToProps)(FormSpatial);
