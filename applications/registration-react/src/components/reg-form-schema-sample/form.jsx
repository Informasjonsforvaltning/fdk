import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import InputTagsField from '../reg-form-field-input-tags';
import TextAreaField from '../reg-form-field-textarea';
import asyncValidate from '../../utils/asyncValidate';
import { textType, licenseType } from '../../schemaTypes';

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
                title="Tilgangslenke"
                helptextItems={helptextItems.Distribution_accessURL}
              />
              <Field
                name={`${sample}.accessURL.0`}
                type="text"
                component={InputField}
                label="Tilgangslenke"
              />
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
                title="Beskrivelse"
                helptextItems={helptextItems.Distribution_description}
              />
              <Field
                name={`${sample}.description.nb`}
                component={TextAreaField}
                label="Beskrivelse"
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
