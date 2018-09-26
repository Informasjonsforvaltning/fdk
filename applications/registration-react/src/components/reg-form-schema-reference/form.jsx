import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import SelectField from '../reg-form-field-select';
import asyncValidate from '../../utils/asyncValidate';

const renderReferenceFields = (
  item,
  index,
  fields,
  componentProps,
  referenceTypesItems,
  referenceDatasetsItems
) => (
  <div className="d-flex mb-2" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.referenceType`}
        component={SelectField}
        items={referenceTypesItems}
      />
    </div>
    <div className="w-50">
      <Field
        name={`${item}.source`}
        component={SelectField}
        items={referenceDatasetsItems}
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
            `remove_references_${index}`
          );
        }}
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);

export const renderReference = componentProps => {
  const {
    fields,
    referenceTypesItems,
    referenceDatasetsItems
  } = componentProps;
  return (
    <div>
      {fields &&
        fields.map((item, index) =>
          renderReferenceFields(
            item,
            index,
            fields,
            componentProps,
            referenceTypesItems,
            referenceDatasetsItems
          )
        )}
      <button
        className="fdk-btn-no-border"
        type="button"
        onClick={() => fields.push({})}
      >
        <i className="fa fa-plus mr-2" />
        {localization.schema.reference.addReferenceLabel}
      </button>
    </div>
  );
};

const FormReference = props => {
  const { helptextItems, initialValues } = props;
  const { referenceTypesItems, referenceDatasetsItems } = initialValues;
  if (initialValues) {
    return (
      <form>
        <div className="form-group">
          <Helptext
            title={localization.schema.reference.helptext.reference}
            helptextItems={helptextItems.Dataset_relation}
          />
          <FieldArray
            name="references"
            component={renderReference}
            referenceTypesItems={referenceTypesItems}
            referenceDatasetsItems={referenceDatasetsItems}
          />
        </div>
      </form>
    );
  }
  return null;
};

FormReference.defaultProps = {
  initialValues: null
};

FormReference.propTypes = {
  initialValues: PropTypes.object,
  helptextItems: PropTypes.object.isRequired
};

export default FormReference;
