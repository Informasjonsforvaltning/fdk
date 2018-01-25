import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import moment from 'moment';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import InputTagsFieldArray from '../reg-form-field-input-tags-objects';
import TextAreaField from '../reg-form-field-textarea';
import DatepickerField from '../reg-form-field-datepicker';
import CheckboxField from '../reg-form-field-checkbox';
import asyncValidate from '../../utils/asyncValidate';


const validate = values => {
  const errors = {}
  const spatial = (values.spatial && values.spatial.uri) ? values.spatial.uri : null;
  if (spatial && spatial.length < 2) {
    errors.spatial = { uri: localization.validation.minTwoChars}
  }
  return errors
}

const formatIssued = value => moment(value).format('YYYY-MM-DD')


/*
const renderLanguage = ({ input, label, type, meta: { touched, error, warning }, prefLabel, name, code }) => {
  if (input.value && input.value.length > 0) {
    const langCodes = input.value.map(item => {
      return item.code
    });
    console.log("langCodes", JSON.stringify(langCodes));
    return (
      <div>
        <Field
          name="language"
          value="ENG"
          component={CheckboxField}
        />
        <Field
          name="language"
          value="NOR"
          component={CheckboxField}
        />
        <Field
          name="language"
          value="SAM"
          component={CheckboxField}
        />
      </div>
    );
  } return null;
};
*/

const removeFunction = values => {
  console.log("removeFunction values", JSON.stringify(values));
}

const renderTemporal = (props) => {
  const { fields, meta: { touched, error, submitFailed }, helptextItems } = props;
  return (
    <div>
      {fields.map((item, index) =>
        <div className="d-flex" key={index}>
          <div className="w-50">
        <Field
          name={`${item}.startDate`}
          type="text"
          component={DatepickerField}
          label="Tidsmessig avgrenset fra"
        />
          </div>
          <div className="w-50">
        <Field
        name={`${item}.endDate`}
        type="text"
        component={DatepickerField}
        label="Tidsmessig avgrenset til"
        />
          </div>
          <div className="d-flex align-items-end">
            <button
              type="button"
              title="Remove temporal"
              onClick={(e) => {fields.remove(index); asyncValidate(fields.getAll(), null, props, `remove_${index}`);}}>
              <i className="fa fa-trash mr-2" />
            </button>
          </div>
      </div>
      )}
      <button type="button" onClick={() => fields.push({})}>
        <i className="fa fa-plus mr-2" />
        Legg til tidsperiode
      </button>
    </div>
  );
};

let FormSpatial = props => {
  const {handleSubmit, pristine, submitting, helptextItems, initialValues, value} = props;
  //console.log("props", JSON.stringify(props));
  const { spatial } = initialValues;
  if (spatial && spatial.length > 0) {
    return (
      <form>
        <div className="form-group">
          <Helptext title="Geografisk avgrensning" required helptextItems={helptextItems.Dataset_spatial}/>
          <Field
            name="spatial"
            type="text"
            component={InputTagsFieldArray}
            label="Geografisk avgrensning"
            onChange={(e, value) => {asyncValidate({spatial: value})}}
          />
        </div>
        <div className="form-group">
          <Helptext title="Tidsmessig avgrenset til" required helptextItems={helptextItems.Dataset_temporal}/>
          <FieldArray
            name="temporal"
            component={renderTemporal}
            onChange={(e, value) => {asyncValidate({temporal: value})}}
          />
        </div>
        <div className="form-group">
          <Helptext title="Utgivelsesdato" required helptextItems={helptextItems.Dataset_issued}/>
          <Field
            name="issued"
            type="text"
            component={DatepickerField}
            label="Utgivelsesdato"
          />
        </div>
        <div className="form-group">
          <Helptext title="Språk" helptextItems={helptextItems.Dataset_language} />
          <Field
            name="language"
            component={CheckboxField}
            onChange={(e, value) => {asyncValidate({language: value})}}
          />
        </div>

      </form>
    )
  } return null;
  //}
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
FormSpatial = reduxForm({
  form: 'spatial',  // a unique identifier for this form,
  validate,
  asyncValidate,
  //asyncBlurFields: [],
  //asyncChangeFields: [],
})(FormSpatial)



const formatTemporalUnixDatesToISO = values => {
  let temporals = values.map(item => {
    return (
      {
        startDate: moment(item.startDate).format('YYYY-MM-DD'),
        endDate: moment(item.endDate).format('YYYY-MM-DD'),
      }
    );
  })
  return temporals;
}

// You have to connect() to any reducers that you wish to connect to yourself
FormSpatial = connect(
  state => ({
    //initialValues: state.dataset.result || {} // pull initial values from dataset reducer
    initialValues: {
      spatial: state.dataset.result.spatial || {},
      issued: moment(state.dataset.result.issued).format('YYYY-MM-DD') || '',
      language: state.dataset.result.language || null,
      temporal: formatTemporalUnixDatesToISO(state.dataset.result.temporal)
    }
  })
)(FormSpatial)

export default FormSpatial;
