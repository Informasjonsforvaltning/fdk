import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import InputTagsField from '../reg-form-field-input-tags';
import TextAreaField from '../reg-form-field-textarea';
import RadioField from '../reg-form-field-radio';
import SelectField from '../reg-form-field-select';
import asyncValidate from '../../utils/asyncValidate';
import { textType, licenseType } from '../../schemaTypes';

const renderSampleLandingpage = (componentProps) => (
  <div>
    {componentProps.fields.map((item, index) =>
      (<Field
        key={index}
        name={`${item}.uri`}
        component={InputField}
        label="Landingsside"
      />)
    )}
  </div>
);

const renderSamples = (componentProps) => {
  const { fields, helptextItems, openLicenseItems } = componentProps
  return (
    <div>
      {fields.map((sample, index) => (
        <div key={index}>
          <div className="d-flex">
            <button
              className="fdk-btn-no-border"
              type="button"
              title="Remove distribution"
              onClick={() => {fields.remove(index); asyncValidate(fields.getAll(), null, componentProps, `remove_sample_${index}`);}}
            >
              <i className="fa fa-trash mr-2" />
                Slett eksempeldata
            </button>
          </div>
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
            <Field
              name={`${sample}.license`}
              component={SelectField}
              items={openLicenseItems}
            />
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
      {fields && fields.length === 0 &&
      <button
        className="fdk-btn-no-border"
        type="button"
        onClick={() => fields.push(
          {
            id: '',
            description: textType,
            accessURL: [],
            license: licenseType,
            conformsTo: [],
            page: [licenseType],
            format: [],
            type: ''
          }
        )}
      >
        <i className="fa fa-plus mr-2" />
        Legg til eksempeldata
      </button>
      }
    </div>
  );
}

const FormSample = props => {
  const { helptextItems, initialValues } = props;
  const { openLicenseItems } = initialValues;
  return (
    <form>
      <FieldArray
        name="sample"
        component={renderSamples}
        helptextItems={helptextItems}
        openLicenseItems={openLicenseItems}
      />
    </form>
  )
}

FormSample.defaultProps = {
  initialValues: null
}

FormSample.propTypes = {
  initialValues: PropTypes.object,
  helptextItems: PropTypes.object.isRequired,
}

export default FormSample
