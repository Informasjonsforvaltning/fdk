import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import _throttle from 'lodash/throttle';

import Form from './form-provenance.component';
import validate from './form-provenance-validations';
import asyncValidate from '../../../utils/asyncValidate';
import { currentnessAnnotationType } from '../../../schemaTypes';

const FormProvenance = reduxForm({
  form: 'provenance',
  validate,
  asyncValidate: _throttle(asyncValidate, 250)
})(Form);

const mapStateToProps = ({ dataset, frequency, provenance }) => ({
  initialValues: {
    frequencyItems: frequency.frequencyItems,
    provenanceItems: provenance.provenanceItems,
    provenance: dataset.result.provenance || {},
    modified: dataset.result.modified
      ? moment(dataset.result.modified).format('YYYY-MM-DD')
      : null,
    hasCurrentnessAnnotation:
      dataset.result.hasCurrentnessAnnotation || currentnessAnnotationType,
    accrualPeriodicity: dataset.result.accrualPeriodicity
  }
});

export default connect(mapStateToProps)(FormProvenance);
