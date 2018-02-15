import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import moment from 'moment';
import _throttle from 'lodash/throttle';

import Helptext from '../reg-form-helptext';
import SelectField from '../reg-form-field-select';
import TextAreaField from '../reg-form-field-textarea';
import DatepickerField from '../reg-form-field-datepicker';
import asyncValidate from '../../utils/asyncValidate';
import { validateMinTwoChars } from '../../validation/validation';

const validate = values => {
  const errors = {}
  let errorHasCurrentnessAnnotation = {};
  const hasCurrentnessAnnotation = (values.hasCurrentnessAnnotation && values.hasCurrentnessAnnotation.hasBody) ? values.hasCurrentnessAnnotation.hasBody.no : null;
  errorHasCurrentnessAnnotation = validateMinTwoChars('hasBody', hasCurrentnessAnnotation, errorHasCurrentnessAnnotation, 'no');

  if (JSON.stringify(errorHasCurrentnessAnnotation) !== '{}') {
    errors.hasCurrentnessAnnotation = errorHasCurrentnessAnnotation;
  }
  return errors
}

const handleProvenanceChange = (props, event, provenanceItem) => {
  const { input } = props;
  props.meta.touched.true;

  // Skal fjerne fra array
  if (!event.target.checked) {
    input.onChange(null);
  }
  // Skal legge til array
  else {
    input.onChange(provenanceItem);
  }
}

const renderProvenance = (props) => {
  const { input, label, provenanceItems } = props;
  let provenanceNodes;
  if (provenanceItems) {
    provenanceNodes = Object.keys(provenanceItems).map(key => {
      if (provenanceItems[key].code) {
        const { code } = provenanceItems[key];
        return (
          <div
            key={key}
            className="form-check fdk-form-checkbox"
          >
            <input
              type="checkbox"
              name="provenance"
              id={provenanceItems[key].code}
              value={provenanceItems[key].code}
              checked={(input.value && input.value.uri && input.value.uri.includes(`${provenanceItems[key].uri}`)) ? 'checked' : ''}
              onChange={(e) => handleProvenanceChange(props, e, provenanceItems[code] )}
            />
            <label className="form-check-label fdk-form-check-label" htmlFor={provenanceItems[key].code} />
            <span>{provenanceItems[key].prefLabel.no || provenanceItems[key].prefLabel.nb}</span>
          </div>
        );
      } return null;
    })
    return provenanceNodes;
  } return null;
}

let FormProvenance = props => {
  const { helptextItems, initialValues} = props;
  const { modified, provenanceItems, frequencyItems } = initialValues;
  if (modified) {
    return (
      <form>
        <div className="form-group">
          <Helptext title="Opphav" helptextItems={helptextItems.Dataset_provenance} />
          <Field
            name="provenance"
            component={renderProvenance}
            provenanceItems={provenanceItems}
          />
        </div>
        <div className="form-group">
          <Helptext title="Oppdateringsfrekvens" helptextItems={helptextItems.Dataset_accruralPeriodicity} />
          <Field
            name="accrualPeriodicity"
            component={SelectField}
            items={frequencyItems}
          />
        </div>
        <div className="form-group">
          <Helptext title="Sist oppdatert" helptextItems={helptextItems.Dataset_modified} />
          <Field
            name="modified"
            type="text"
            component={DatepickerField}
            label="Sist oppdatert"
          />
        </div>
        <div className="form-group">
          <Helptext title="Aktualitet" helptextItems={helptextItems.Dataset_hasQualityAnnotation_currentness} />
          <Field name="hasCurrentnessAnnotation.hasBody.no" component={TextAreaField} label="Aktualitet" />
        </div>
      </form>
    )
  } return null;
}

FormProvenance = reduxForm({
  form: 'provenance',
  validate,
  asyncValidate: _throttle(asyncValidate, 250),
})(FormProvenance)

const mapStateToProps = ({ dataset, frequency, provenance }) => (
  {
    initialValues: {
      frequencyItems: frequency.frequencyItems,
      provenanceItems: provenance.provenanceItems,
      provenance: dataset.result.provenance || {},
      modified: moment(dataset.result.modified).format('YYYY-MM-DD') || '',
      hasCurrentnessAnnotation: dataset.result.hasCurrentnessAnnotation,
      accrualPeriodicity: dataset.result.accrualPeriodicity
    }
  }
)

export default connect(mapStateToProps)(FormProvenance)
