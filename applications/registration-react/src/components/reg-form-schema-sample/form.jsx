import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import InputTagsField from '../reg-form-field-input-tags';
import asyncValidate from '../../utils/asyncValidate';
import { textType, licenseType } from '../../schemaTypes';

const renderSampleLandingpage = componentProps => (
  <div>
    {componentProps.fields.map((item, index) => (
      <Field
        key={index}
        name={`${item}.uri`}
        component={InputField}
        label="Landingsside"
      />
    ))}
  </div>
);

export const renderSamples = componentProps => {
  const { fields, helptextItems } = componentProps;
  return (
    <div>
      {fields &&
        fields.map((sample, index) => (
          <div key={index}>
            <div className="d-flex">
              <button
                className="fdk-btn-no-border"
                type="button"
                title="Remove distribution"
                onClick={() => {
                  fields.remove(index);
                  asyncValidate(
                    fields.getAll(),
                    null,
                    componentProps,
                    `remove_sample_${index}`
                  );
                }}
              >
                <i className="fa fa-trash mr-2" />
                Slett eksempeldata
              </button>
            </div>
            <div className="form-group">
              <Helptext
                title="Format"
                helptextItems={helptextItems.Distribution_format}
              />
              <Field
                name={`${sample}.format`}
                type="text"
                component={InputTagsField}
                label="Format"
              />
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
          </div>
        ))}
      {fields &&
        fields.length === 0 && (
          <button
            className="fdk-btn-no-border"
            type="button"
            onClick={() =>
              fields.push({
                id: '',
                description: textType,
                accessURL: [],
                license: licenseType,
                conformsTo: [],
                page: [licenseType],
                format: [],
                type: ''
              })
            }
          >
            <i className="fa fa-plus mr-2" />
            Legg til eksempeldata
          </button>
        )}
    </div>
  );
};

export const FormSample = props => {
  const { helptextItems } = props;
  return (
    <form>
      <FieldArray
        name="sample"
        component={renderSamples}
        helptextItems={helptextItems}
      />
    </form>
  );
};

FormSample.defaultProps = {};

FormSample.propTypes = {
  helptextItems: PropTypes.object.isRequired
};

export default FormSample;
