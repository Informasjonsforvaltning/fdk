import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';
import InputTagsField from '../../../components/field-input-tags/field-input-tags.component';
import TextAreaField from '../../../components/field-textarea/field-textarea.component';
import { handleDatasetDeleteFieldPatch } from '../formsLib/formHandlerDatasetPatch';
import { textType, licenseType } from '../../../schemaTypes';

export const renderSamples = componentProps => {
  const {
    catalogId,
    datasetId,
    fields,
    helptextItems,
    dispatch
  } = componentProps;
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
                  handleDatasetDeleteFieldPatch(
                    catalogId,
                    datasetId,
                    'sample',
                    fields,
                    index,
                    dispatch
                  );
                }}
              >
                <i className="fa fa-trash mr-2" />
                {localization.schema.sample.deleteSampleLabel}
              </button>
            </div>
            <div className="form-group">
              <Helptext title={localization.schema.sample.helptext.accessURL} />
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
  const { helptextItems, dispatch, catalogId, datasetId } = props;
  return (
    <form>
      <FieldArray
        name="sample"
        component={renderSamples}
        helptextItems={helptextItems}
        dispatch={dispatch}
        catalogId={catalogId}
        datasetId={datasetId}
      />
    </form>
  );
};

FormSample.defaultProps = {
  dispatch: null,
  catalogId: null,
  datasetId: null
};

FormSample.propTypes = {
  helptextItems: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string
};
