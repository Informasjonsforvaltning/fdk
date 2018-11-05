import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../utils/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';
import InputTagsField from '../../../components/field-input-tags/field-input-tags.component';
import TextAreaField from '../../../components/field-textarea/field-textarea.component';
import asyncValidate from '../../../utils/asyncValidate';
import { textType, licenseType } from '../../../schemaTypes';

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
                title={localization.schema.sample.removeSample}
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
                {localization.schema.sample.deleteSampleLabel}
              </button>
            </div>
            <div className="form-group">
              <Helptext
                title={localization.schema.sample.helptext.accessURL}
                helptextItems={helptextItems.Distribution_accessURL}
              />
              <Field
                name={`${sample}.accessURL.0`}
                type="text"
                component={InputField}
                label={localization.schema.sample.accessURLLabel}
              />
            </div>
            <div className="form-group">
              <Helptext
                title={localization.schema.sample.helptext.format}
                helptextItems={helptextItems.Distribution_format}
              />
              <Field
                name={`${sample}.format`}
                type="text"
                component={InputTagsField}
                label={localization.schema.sample.formatLabel}
              />
            </div>
            <div className="form-group">
              <Helptext
                title={localization.schema.sample.helptext.description}
                helptextItems={helptextItems.Distribution_description}
              />
              <Field
                name={`${sample}.description.${localization.getLanguage()}`}
                component={TextAreaField}
                label={localization.schema.sample.descriptionLabel}
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
            {localization.schema.sample.addSampleLabel}
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
