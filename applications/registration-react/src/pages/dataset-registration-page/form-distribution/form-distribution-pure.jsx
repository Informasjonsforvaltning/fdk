import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';

import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import InputField from '../../../components/fields/field-input/field-input.component';
import InputTagsField from '../../../components/fields/field-input-tags/field-input-tags.component';
import TextAreaField from '../../../components/fields/field-textarea/field-textarea.component';
import RadioField from '../../../components/fields/field-radio/field-radio.component';
import SelectField from '../../../components/fields/field-select/field-select.component';
import { licenseType, textType } from '../../../schemaTypes';
import { datasetFormPatchThunk } from '../formsLib/asyncValidateDatasetInvokePatch';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';
import LinkReadonlyField from '../../../components/fields/field-link-readonly/field-link-readonly.component';
import InputFieldReadonly from '../../../components/fields/field-input-readonly/field-input-readonly.component';
import { getTranslateText } from '../../../services/translateText';

export const renderDistributionLandingpage = ({ fields, isReadOnly }) => {
  return (
    <div>
      {fields &&
        fields.map((item, index) => (
          <Field
            key={index}
            name={`${item}.uri`}
            component={isReadOnly ? LinkReadonlyField : InputField}
            label={localization.schema.distribution.landingPageLabel}
          />
        ))}
    </div>
  );
};
renderDistributionLandingpage.propTypes = {
  fields: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};

const renderFomatsReadOnly = ({ input }) => {
  return <div className="pl-3">{input.value.join(', ')}</div>;
};
renderFomatsReadOnly.propTypes = {
  input: PropTypes.object.isRequired
};

const renderLicence = ({ input }) => {
  return (
    <div className="pl-3">
      {getTranslateText(_.get(input, ['value', 'prefLabel']))}
    </div>
  );
};
renderLicence.propTypes = {
  input: PropTypes.object.isRequired
};

export const renderDistributions = ({
  fields,
  openLicenseItems,
  initialValues,
  onDeleteFieldAtIndex,
  languages,
  isReadOnly
}) => {
  return (
    <div>
      {fields &&
        fields.map((distribution, index) => {
          if (_.get(initialValues, ['distribution', index, 'accessService'])) {
            return null;
          }
          return (
            <div key={index}>
              <div className="d-flex">
                <h4>Distribusjon #{index + 1}</h4>
                {!isReadOnly && (
                  <button
                    className="fdk-btn-no-border"
                    type="button"
                    title="Remove distribution"
                    onClick={() => onDeleteFieldAtIndex(fields, index)}
                  >
                    <i className="fa fa-trash mr-2" />
                    {localization.schema.distribution.deleteDistributionLabel}
                  </button>
                )}
              </div>
              <div className="form-group">
                <Helptext
                  title={localization.schema.distribution.helptext.type}
                  term="Distribution_type"
                />
                {isReadOnly && (
                  <>
                    <div className="pl-3">
                      {_.get(initialValues, ['distribution', index, 'type'])}
                    </div>
                  </>
                )}
                {!isReadOnly && (
                  <>
                    <Field
                      name={`${distribution}.type`}
                      radioId={`distribution-api-${index}`}
                      component={RadioField}
                      type="radio"
                      value="API"
                      label={localization.schema.distribution.apiLabel}
                    />
                    <Field
                      name={`${distribution}.type`}
                      radioId={`distribution-feed-${index}`}
                      component={RadioField}
                      type="radio"
                      value="Feed"
                      label={localization.schema.distribution.feedLabel}
                    />
                    <Field
                      name={`${distribution}.type`}
                      radioId={`distribution-file-${index}`}
                      component={RadioField}
                      type="radio"
                      value="Nedlastbar fil"
                      label={localization.schema.distribution.downloadLabel}
                    />
                  </>
                )}
              </div>
              <div className="form-group">
                <Helptext
                  title={localization.schema.distribution.helptext.accessURL}
                  term="Distribution_accessURL"
                />
                <Field
                  name={`${distribution}.accessURL.0`}
                  type="text"
                  component={isReadOnly ? LinkReadonlyField : InputField}
                  label={localization.schema.distribution.accessURLLabel}
                />
              </div>
              <div className="form-group">
                <Helptext
                  title={localization.schema.distribution.helptext.format}
                  term="Distribution_format"
                  required
                />
                <Field
                  name={`${distribution}.format`}
                  type="text"
                  component={isReadOnly ? renderFomatsReadOnly : InputTagsField}
                  label={localization.schema.distribution.formatLabel}
                  // todo Proper fix needed. right now is temporarily removed because
                  //  validation somehow causes render loop
                  // validate={[minLength(1)]}
                />
              </div>
              <div className="form-group">
                <Helptext
                  title={localization.schema.distribution.helptext.license}
                  term="Distribution_modified"
                />
                <Field
                  name={`${distribution}.license`}
                  component={isReadOnly ? renderLicence : SelectField}
                  items={openLicenseItems}
                />
              </div>
              <div className="form-group">
                <Helptext
                  title={localization.schema.distribution.helptext.description}
                  term="Distribution_description"
                />
                <MultilingualField
                  name={`${distribution}.description`}
                  component={isReadOnly ? InputFieldReadonly : TextAreaField}
                  label={localization.schema.distribution.descriptionLabel}
                  languages={languages}
                />
              </div>

              <div className="form-group">
                <Helptext
                  title={
                    localization.schema.distribution.helptext.documentation
                  }
                  term="Distribution_documentation"
                />
                <FieldArray
                  name={`${distribution}.page`}
                  component={renderDistributionLandingpage}
                  isReadOnly={isReadOnly}
                />
              </div>

              <div className="form-group">
                <Helptext
                  title={localization.schema.distribution.helptext.conformsTo}
                  term="Distribution_conformsTo"
                />
                <div className="d-flex flex-column">
                  <MultilingualField
                    name={`${distribution}.conformsTo[0].prefLabel`}
                    component={isReadOnly ? InputFieldReadonly : TextAreaField}
                    label={localization.schema.common.titleLabel}
                    showLabel
                    languages={languages}
                  />
                  <div className="mt-2">
                    <Field
                      name={`${distribution}.conformsTo[0].uri`}
                      component={isReadOnly ? LinkReadonlyField : TextAreaField}
                      showLabel
                      label={localization.schema.common.linkLabel}
                    />
                  </div>
                </div>
              </div>
              <hr />
            </div>
          );
        })}
      {!isReadOnly && (
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
          {localization.schema.distribution.addDistributionLabel}
        </button>
      )}
    </div>
  );
};
renderDistributions.propTypes = {
  fields: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  openLicenseItems: PropTypes.array.isRequired,
  onDeleteFieldAtIndex: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};

export const FormDistributionPure = ({
  initialValues,
  openLicenseItems,
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
        name="distribution"
        component={renderDistributions}
        openLicenseItems={openLicenseItems}
        initialValues={initialValues}
        onDeleteFieldAtIndex={deleteFieldAtIndex}
        languages={languages}
        isReadOnly={isReadOnly}
      />
    </form>
  );
};

FormDistributionPure.defaultProps = {
  dispatch: null,
  catalogId: null,
  datasetId: null,
  openLicenseItems: [],
  languages: [],
  isReadOnly: false
};
FormDistributionPure.propTypes = {
  initialValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string,
  openLicenseItems: PropTypes.array,
  languages: PropTypes.array,
  isReadOnly: PropTypes.bool
};
