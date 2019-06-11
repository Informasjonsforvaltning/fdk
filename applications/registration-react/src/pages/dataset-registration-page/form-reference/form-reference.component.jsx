import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import SelectField from '../../../components/field-select/field-select.component';
import { datasetFormPatchThunk } from '../formsLib/asyncValidateDatasetInvokePatch';

const renderReferenceFields = ({
  item,
  index,
  fields,
  referenceTypesItems,
  referenceDatasetsItems,
  onDeleteFieldAtIndex
}) => (
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
        labelKey="title"
      />
    </div>
    <div className="d-flex align-items-end">
      <button
        className="fdk-btn-no-border"
        type="button"
        title="Remove reference"
        onClick={() => onDeleteFieldAtIndex(fields, index)}
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);
renderReferenceFields.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  referenceTypesItems: PropTypes.array.isRequired,
  referenceDatasetsItems: PropTypes.array.isRequired,
  onDeleteFieldAtIndex: PropTypes.func.isRequired
};

export const renderReference = ({
  fields,
  referenceTypesItems,
  referenceDatasetsItems,
  onDeleteFieldAtIndex
}) => {
  return (
    <div>
      {fields &&
        fields.map((item, index) =>
          renderReferenceFields({
            item,
            index,
            fields,
            referenceTypesItems,
            referenceDatasetsItems,
            onDeleteFieldAtIndex
          })
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
renderReference.propTypes = {
  fields: PropTypes.object.isRequired,
  referenceTypesItems: PropTypes.array.isRequired,
  referenceDatasetsItems: PropTypes.array.isRequired,
  onDeleteFieldAtIndex: PropTypes.func.isRequired
};
export const FormReference = props => {
  const { initialValues, dispatch, catalogId, datasetId } = props;
  const { referenceTypesItems, referenceDatasetsItems } = initialValues;
  const deleteFieldAtIndex = (fields, index) => {
    const values = fields.getAll();
    // use splice instead of skip, for changing the bound value
    values.splice(index, 1);
    const patch = { [fields.name]: values };
    const thunk = datasetFormPatchThunk({ catalogId, datasetId, patch });
    dispatch(thunk);
  };

  if (initialValues) {
    return (
      <form>
        <div className="form-group">
          <Helptext
            title={localization.schema.reference.helptext.reference}
            terms="Dataset_relation"
          />
          <FieldArray
            name="references"
            component={renderReference}
            referenceTypesItems={referenceTypesItems}
            referenceDatasetsItems={referenceDatasetsItems}
            onDeleteFieldAtIndex={deleteFieldAtIndex}
          />
        </div>
      </form>
    );
  }
  return null;
};

FormReference.defaultProps = {
  initialValues: null,
  dispatch: null,
  catalogId: null,
  datasetId: null
};

FormReference.propTypes = {
  initialValues: PropTypes.object,
  dispatch: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string
};
