import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux'

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import InputTagsField from '../reg-form-field-input-tags';
import TextAreaField from '../reg-form-field-textarea';
import RadioField from '../reg-form-field-radio';
import asyncValidate from '../../utils/asyncValidate';

const validate = values => {
  const errors = {}
  const { distribution } = values;
  let errorNodes = null;

  if (distribution) {
    errorNodes = distribution.map((item, index) => {
      const errors = {}
      const description = (item.description && item.description.nb) ? item.description.nb : null;
      const license = (item.license && item.license.uri) ? item.license.uri : null;
      const page = (item.page && item.page[index].uri) ? item.page[index].uri : null;

      if (license && license.length < 2) {
        errors.license = { uri: localization.validation.minTwoChars}
      }

      if (description && description.length < 2) {
        errors.description = { nb: localization.validation.minTwoChars}
      }

      if (page && page.length < 2) {
        errors.page = [{uri: localization.validation.minTwoChars}]
      }

      return errors;
    });
  }
  return errors
}

const renderSampleLandingpage = ({ fields }) => (
  <div>
    {fields.map((item, index) =>
      (<Field
        key={index}
        name={`${item}.uri`}
        component={InputField}
        label="Landingsside"
      />)
    )}
  </div>
);

const renderSamples = (props) => {
  const { fields, helptextItems } = props
  return (
    <div>
      {fields.map((sample, index) => (
        <div key={index}>
          <div className="d-flex">
            <h4>Eksempeldata</h4>
          </div>
          <div className="form-group">
            <Helptext helptextItems={helptextItems.Dataset_example} />
            <Field name={`${sample}.type`} component={RadioField} type="radio" value="API" label="API" onChange={(e, value) => {asyncValidate({sample: fields.getAll()}, {}, props, '')}} />
            <Field name={`${sample}.type`} component={RadioField} type="radio" value="Feed" label="Feed" onChange={(e, value) => {asyncValidate({sample: fields.getAll()})}} />
            <Field name={`${sample}.type`} component={RadioField} type="radio" value="Nedlastbar fil" label="Nedlastbar fil" />
          </div>
          <div className="form-group">
            <Helptext title="Tilgangs URL" helptextItems={helptextItems.Distribution_accessURL} />
            <Field
              name={`${sample}.accessURL.0`}
              type="text"
              component={InputField}
              label="Tilgangs URL"
            />
          </div>
          <div className="form-group">
            <Helptext title="Tilgangs URL" helptextItems={helptextItems.Distribution_accessURL} />
            <Field
              name={`${sample}.format`}
              type="text"
              component={InputTagsField}
              label="Format"
            />
          </div>
          <div className="form-group">
            <Helptext title="Lisens" helptextItems={helptextItems.Distribution_modified} />
            <Field name={`${sample}.license.uri`} component={InputField} label="Lisens" />
          </div>
          <div className="form-group">
            <Helptext title="Beskrivelse" helptextItems={helptextItems.Distribution_description} />
            <Field name={`${sample}.description.nb`} component={TextAreaField} label="Beskrivelse" />
          </div>

          <div className="form-group">
            <Helptext
              title="Lenke til dokumentasjon av distribusjonen"
              helptextItems={helptextItems.Distribution_documentation}
            />
            <FieldArray
              name={`${sample}.page`}
              component={renderSampleLandingpage}
              helptextItems={helptextItems}
            />
          </div>

          <div className="form-group">
            <Helptext
              helptextItems={helptextItems.Distribution_conformsTo}
            />
            <div className="d-flex">
              <div className="w-50">
                <Field name={`${sample}.conformsTo[0].prefLabel.nb`} component={InputField} label="Tittel på standard" />
              </div>
              <div className="w-50">
                <Field name={`${sample}.conformsTo[0].uri`} component={InputField} label="Lenke til standard" />
              </div>
            </div>
          </div>
        </div>
      )
      )}
    </div>
  );
}

let FormSample = props => {
  const { helptextItems } = props;
  return (
    <form>
      <FieldArray
        name="sample"
        component={renderSamples}
        helptextItems={helptextItems}
      />
    </form>
  )
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
FormSample = reduxForm({
  form: 'sample',
  validate,
  asyncValidate,
})(FormSample)

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      sample: dataset.result.sample || null
    }
  }
)

export default connect(mapStateToProps)(FormSample)
