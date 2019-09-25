import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import TagsInputFieldArray from '../../../components/fields/field-input-tags-objects/tags-input-field-array.component';
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

export const FormSpatial = ({
  initialValues,
  dispatch,
  catalogId,
  datasetId
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
          <Field
            name="spatial"
            type="text"
            component={TagsInputFieldArray}
            label={localization.schema.spatial.spatialLabel}
            fieldLabel="uri"
          />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.spatial.helptext.temporal}
            term="Dataset_temporal"
          />
          <FieldArray
            name="temporal"
            component={renderTemporal}
            onDeleteFieldAtIndex={deleteFieldAtIndex}
          />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.spatial.helptext.issued}
            term="Dataset_issued"
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
            term="Dataset_language"
          />
          <Field name="language" component={CheckboxField} />
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
  datasetId: null
};

FormSpatial.propTypes = {
  initialValues: PropTypes.object,
  dispatch: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string
};
