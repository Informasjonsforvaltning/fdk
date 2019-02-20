import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputTagsFieldArray from '../../../components/field-input-tags-objects/field-input-tags-objects.component';
import DatepickerField from '../../../components/field-datepicker/field-datepicker.component';
import CheckboxField from '../../../components/field-checkbox/field-checkbox.component';
import asyncValidate from '../../../lib/asyncValidate';

export const renderTemporalFields = (item, index, fields, componentProps) => (
  <div className="d-flex mb-2" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.startDate`}
        type="text"
        component={DatepickerField}
        label={localization.schema.common.startDateLabel}
        showLabel
      />
    </div>
    <div className="w-50">
      <Field
        name={`${item}.endDate`}
        type="text"
        component={DatepickerField}
        label={localization.schema.common.endDateLabel}
        showLabel
      />
    </div>
    <div className="d-flex align-items-end">
      <button
        className="fdk-btn-no-border"
        type="button"
        title="Remove temporal"
        onClick={() => {
          if (fields.length === 1) {
            fields.remove(index);
            fields.push({});
          }

          if (fields.length > 1) {
            fields.remove(index);
          }
          asyncValidate(
            fields.getAll(),
            null,
            componentProps,
            `remove_temporal_${index}`
          );
        }}
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);

export const renderTemporal = componentProps => {
  const { fields } = componentProps;

  return (
    <div>
      {fields &&
        fields.map((item, index) =>
          renderTemporalFields(item, index, fields, componentProps)
        )}
      <button
        className="fdk-btn-no-border"
        type="button"
        onClick={() => fields.push({})}
      >
        <i className="fa fa-plus mr-2" />
        {localization.schema.common.addTime}
      </button>
    </div>
  );
};

export const FormSpatial = props => {
  const { helptextItems, initialValues } = props;
  if (initialValues) {
    return (
      <form>
        <div className="form-group">
          <Helptext
            title={localization.schema.spatial.helptext.spatial}
            helptextItems={helptextItems.Dataset_spatial}
          />
          <Field
            name="spatial"
            type="text"
            component={InputTagsFieldArray}
            label={localization.schema.spatial.spatialLabel}
            fieldLabel="uri"
          />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.spatial.helptext.temporal}
            helptextItems={helptextItems.Dataset_temporal}
          />
          <FieldArray name="temporal" component={renderTemporal} />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.spatial.helptext.issued}
            helptextItems={helptextItems.Dataset_issued}
          />
          <Field
            name="issued"
            type="text"
            component={DatepickerField}
            label={localization.schema.spatial.issuedLabel}
          />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.spatial.helptext.language}
            helptextItems={helptextItems.Dataset_language}
          />
          <Field name="language" component={CheckboxField} />
        </div>
      </form>
    );
  }
  return null;
};

FormSpatial.defaultProps = {
  initialValues: null
};

FormSpatial.propTypes = {
  initialValues: PropTypes.object,
  helptextItems: PropTypes.object.isRequired
};
