import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../services/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/fields/field-input/field-input.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';
import InputTagsField from '../../../components/fields/field-input-tags/field-input-tags.component';
import TextAreaField from '../../../components/fields/field-textarea/field-textarea.component';
import { licenseType, textType } from '../../../schemaTypes';
import { datasetFormPatchThunk } from '../formsLib/asyncValidateDatasetInvokePatch';
import LinkReadonlyField from '../../../components/fields/field-link-readonly/field-link-readonly.component';
import InputFieldReadonly from '../../../components/fields/field-input-readonly/field-input-readonly.component';

const renderFormatReadOnly = ({ input }) => {
  return <div>{input.value.join(', ')}</div>;
};
renderFormatReadOnly.propTypes = {
  input: PropTypes.object.isRequired
};

export const renderSamples = ({
  fields,
  onDeleteFieldAtIndex,
  languages,
  isReadOnly
}) => {
  return (
    <div>
      {fields &&
        fields.map((sample, index) => (
          <div key={index}>
            {!isReadOnly && (
              <div className="d-flex">
                <button
                  className="fdk-btn-no-border"
                  type="button"
                  title={localization.schema.sample.removeSample}
                  onClick={() => onDeleteFieldAtIndex(fields, index)}
                >
                  <i className="fa fa-trash mr-2" />
                  {localization.schema.sample.deleteSampleLabel}
                </button>
              </div>
            )}
            <div className="form-group">
              <Helptext title={localization.schema.sample.helptext.accessURL} />
              <Field
                name={`${sample}.accessURL.0`}
                type="text"
                component={isReadOnly ? LinkReadonlyField : InputField}
                label={localization.schema.sample.accessURLLabel}
              />
            </div>
            <div className="form-group">
              <Helptext
                title={localization.schema.sample.helptext.format}
                term="Distribution_format"
              />
              <Field
                name={`${sample}.format`}
                type="text"
                component={isReadOnly ? renderFormatReadOnly : InputTagsField}
                label={localization.schema.sample.formatLabel}
              />
            </div>
            <div className="form-group">
              <Helptext
                title={localization.schema.sample.helptext.description}
              />
              <MultilingualField
                name={`${sample}.description`}
                component={isReadOnly ? InputFieldReadonly : TextAreaField}
                label={localization.schema.sample.descriptionLabel}
                languages={languages}
              />
            </div>
          </div>
        ))}
      {fields && fields.length === 0 && (
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
renderSamples.propTypes = {
  languages: PropTypes.array.isRequired,
  fields: PropTypes.object.isRequired,
  onDeleteFieldAtIndex: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};

export const FormSample = ({
  dispatch,
  catalogId,
  datasetId,
  languages,
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

  return (
    <form>
      <FieldArray
        name="sample"
        component={renderSamples}
        onDeleteFieldAtIndex={deleteFieldAtIndex}
        languages={languages}
        isReadOnly={isReadOnly}
      />
    </form>
  );
};

FormSample.defaultProps = {
  dispatch: null,
  catalogId: null,
  datasetId: null,
  languages: []
};

FormSample.propTypes = {
  dispatch: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string,
  languages: PropTypes.array,
  isReadOnly: PropTypes.bool.isRequired
};
