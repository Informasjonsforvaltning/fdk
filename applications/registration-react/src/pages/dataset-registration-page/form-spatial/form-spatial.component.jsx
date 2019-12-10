import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../services/localization';
import Helptext from '../../../components/helptext/helptext.component';
import TagsInputFieldArray from '../../../components/fields/field-input-tags-objects/tags-input-field-array.component';
import TagsInputFieldArrayReadOnly from '../../../components/fields/field-input-tags-objects-readonly/field-input-tags-objects-readonly.component';
import DatepickerField from '../../../components/fields/field-datepicker/field-datepicker.component';
import CheckboxField from '../../../components/fields/field-checkbox/field-checkbox.component';
import { datasetFormPatchThunk } from '../formsLib/asyncValidateDatasetInvokePatch';

export const renderTemporalFields = ({
  item,
  index,
  fields,
  onDeleteFieldAtIndex
}) => (
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
        onClick={() => onDeleteFieldAtIndex(fields, index)}
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);
renderTemporalFields.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  onDeleteFieldAtIndex: PropTypes.func.isRequired
};

export const renderTemporal = ({ fields, onDeleteFieldAtIndex }) => {
  return (
    <div>
      {fields &&
        fields.map((item, index) =>
          renderTemporalFields({ item, index, fields, onDeleteFieldAtIndex })
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
renderTemporal.propTypes = {
  fields: PropTypes.object.isRequired,
  onDeleteFieldAtIndex: PropTypes.func.isRequired
};

const renderTemporalReadOnlyField = ({ item }) => (
  <div>
    <Field
      name={`${item}.endDate`}
      type="text"
      component={({ input }) => {
        return <span>{input.value} - </span>;
      }}
      label={localization.schema.common.endDateLabel}
      showLabel
    />
    <Field
      name={`${item}.startDate`}
      type="text"
      component={({ input }) => {
        return <span>{input.value}</span>;
      }}
      label={localization.schema.common.endDateLabel}
      showLabel
    />
  </div>
);
const renderTemporalReadOnly = ({ fields }) => {
  return fields.map((item, index) =>
    renderTemporalReadOnlyField({ item, index, fields })
  );
};
const translateCode = code => {
  switch (code) {
    case 'NOR':
      return 'Norsk';
    case 'SMI':
      return 'Samisk';
    case 'ENG':
      return 'Engelsk';
    default:
      return '';
  }
};
const renderLanguageReadOnly = ({ input }) => {
  return input.value.map(item => translateCode(item.code)).join(', ');
};

renderTemporalReadOnly.propTypes = {
  fields: PropTypes.object.isRequired
};

export const FormSpatial = ({
  initialValues,
  dispatch,
  catalogId,
  datasetId,
  isReadOnly
}) => {
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
            title={localization.schema.spatial.helptext.spatial}
            term="Dataset_spatial"
          />
          {isReadOnly && (
            <Field
              name="spatial"
              type="text"
              component={TagsInputFieldArrayReadOnly}
              label={localization.schema.spatial.spatialLabel}
              fieldLabel="uri"
            />
          )}
          {!isReadOnly && (
            <Field
              name="spatial"
              type="text"
              component={TagsInputFieldArray}
              label={localization.schema.spatial.spatialLabel}
              fieldLabel="uri"
            />
          )}
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.spatial.helptext.temporal}
            term="Dataset_temporal"
          />
          {isReadOnly && (
            <FieldArray
              name="temporal"
              component={renderTemporalReadOnly}
              onDeleteFieldAtIndex={deleteFieldAtIndex}
            />
          )}
          {!isReadOnly && (
            <FieldArray
              name="temporal"
              component={renderTemporal}
              onDeleteFieldAtIndex={deleteFieldAtIndex}
            />
          )}
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.spatial.helptext.issued}
            term="Dataset_issued"
          />
          {isReadOnly && (
            <Field
              name="issued"
              type="text"
              component={({ input }) => <div>{input.value}</div>}
              label={localization.schema.spatial.issuedLabel}
            />
          )}
          {!isReadOnly && (
            <Field
              name="issued"
              type="text"
              component={DatepickerField}
              label={localization.schema.spatial.issuedLabel}
            />
          )}
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.spatial.helptext.language}
            term="Dataset_language"
          />

          {isReadOnly && (
            <Field name="language" component={renderLanguageReadOnly} />
          )}
          {!isReadOnly && <Field name="language" component={CheckboxField} />}
        </div>
      </form>
    );
  }
  return null;
};

FormSpatial.defaultProps = {
  initialValues: null,
  dispatch: null,
  catalogId: null,
  datasetId: null,
  isReadOnly: false
};

FormSpatial.propTypes = {
  initialValues: PropTypes.object,
  dispatch: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string,
  isReadOnly: PropTypes.bool
};
