import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _throttle from 'lodash/throttle';

import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import InputTagsField from '../reg-form-field-input-tags';
import TextAreaField from '../reg-form-field-textarea';
import RadioField from '../reg-form-field-radio';
import SelectField from '../reg-form-field-select';
import asyncValidate from '../../utils/asyncValidate';
import { textType, licenseType } from '../../schemaTypes';
import { validateMinTwoChars, validateLinkReturnAsSkosType, validateURL } from '../../validation/validation';

const validate = values => {
  const errors = {}
  const { sample } = values;
  let errorNodes = null;
  let conformsToNodes = null;

  if (sample) {
    errorNodes = sample.map(item => {
      let errors = {}

      const accessURL = item.accessURL ? item.accessURL : null;
      const license = (item.license && item.license.uri) ? item.license.uri : null;
      const description = (item.description && item.description.nb) ? item.description.nb : null;
      const page = (item.page && item.page[0] && item.page[0].uri) ? item.page[0].uri : null;
      const { conformsTo } = item || null;

      errors = validateURL('accessURL', accessURL[0], errors, true);
      errors = validateMinTwoChars('license', license, errors, 'uri');
      errors = validateMinTwoChars('description', description, errors);
      errors = validateLinkReturnAsSkosType('page', page, errors, 'uri');

      if (conformsTo) {
        conformsToNodes = conformsTo.map(item => {
          let itemErrors = {}
          const conformsToPrefLabel = (item.prefLabel && item.prefLabel.nb) ? item.prefLabel.nb : null;
          const conformsToURI = item.uri ? item.uri : null;
          itemErrors = validateMinTwoChars('prefLabel', conformsToPrefLabel, itemErrors);
          itemErrors = validateURL('uri', conformsToURI, itemErrors);
          return itemErrors;
        });
        let showSyncError = false;
        showSyncError = (conformsToNodes.filter(item => (item && JSON.stringify(item) !== '{}')).length > 0);
        if (showSyncError) {
          errors.conformsTo = conformsToNodes;
        }
      }
      return errors;
    });
    let showSyncError = false;
    showSyncError = (errorNodes.filter(item => (item && JSON.stringify(item) !== '{}')).length > 0);
    if (showSyncError) {
      errors.sample = errorNodes;
    }
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
  const { fields, helptextItems, openLicenseItems } = props
  return (
    <div>
      {fields.map((sample, index) => (
        <div key={index}>
          <div className="d-flex">
            <button
              className="fdk-btn-no-border"
              type="button"
              title="Remove distribution"
              onClick={() => {fields.remove(index); asyncValidate(fields.getAll(), null, props, `remove_sample_${index}`);}}
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

let FormSample = props => {
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

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
FormSample = reduxForm({
  form: 'sample',
  validate,
  asyncValidate: _throttle(asyncValidate, 250),
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
    samples = []
  }
  return samples;
}

const mapStateToProps = ({ dataset, openlicenses }) => (
  {
    initialValues: {
      sample: sampleTypes(dataset.result.sample) || [{}],
      openLicenseItems: openlicenses.openLicenseItems
    }
  }
)

export default connect(mapStateToProps)(FormSample)
