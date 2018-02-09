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
import { textType, licenseType } from '../../schemaTypes';

const validate = values => {
  const errors = {}
  const { sample } = values;
  let errorNodes = null;

  if (sample) {
    errorNodes = sample.map((item, index) => {
      const errors = {}
      const description = (item.description && item.description.nb) ? item.description.nb : null;
      const license = (item.license && item.license.uri) ? item.license.uri : null;
      const page = (item.page && item.page[index] && item.page[index].uri) ? item.page[index].uri : null;

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
    return errorNodes;
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
          <div className="form-group">
            <Helptext title="Type" helptextItems={helptextItems.Dataset_example} />
            <Field name={`${sample}.type`} radioId="sample-api" component={RadioField} type="radio" value="API" label="API" />
            <Field name={`${sample}.type`} radioId="sample-feed" component={RadioField} type="radio" value="Feed" label="Feed" />
            <Field name={`${sample}.type`} radioId="sample-file" component={RadioField} type="radio" value="Nedlastbar fil" label="Nedlastbar fil" />
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
            <Helptext title="Format" helptextItems={helptextItems.Distribution_format} />
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
              title="Standard"
              helptextItems={helptextItems.Distribution_conformsTo}
            />
            <div className="d-flex">
              <div className="w-50">
                <Field name={`${sample}.conformsTo[0].prefLabel.nb`} component={InputField} showLabel label="Tittel" />
              </div>
              <div className="w-50">
                <Field name={`${sample}.conformsTo[0].uri`} component={InputField} showLabel label="Lenke" />
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

const sampleTypes = values => {
  let samples  = null;
  if (values && values.length > 0) {
    samples = values.map(item => (
      {
        id: item.id ? item.id : '',
        description: item.description ? item.description : textType,
        accessURL: item.accessURL ? item.accessURL : [],
        license: item.license ? item.license : licenseType,
        conformsTo: item.conformsTo ? item.conformsTo : [],
        page: (item.page && item.page.length > 0) ? item.page : [{}],
        format: item.format ? item.format : [],
        type: item.type ? item.type : ''
      }
    ))
  } else {
    samples = [{
      id: '',
      description: textType,
      accessURL: [],
      license: licenseType,
      conformsTo: [],
      page: [],
      format: [],
      type: ''
    }]
  }
  return samples;
}

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      sample: sampleTypes(dataset.result.sample) || [{}]
    }
  }
)

export default connect(mapStateToProps)(FormSample)
