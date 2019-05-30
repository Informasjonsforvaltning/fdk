import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';
import InputTagsField from '../../../components/field-input-tags/field-input-tags.component';
import TextAreaField from '../../../components/field-textarea/field-textarea.component';
import RadioField from '../../../components/field-radio/field-radio.component';
import SelectField from '../../../components/field-select/field-select.component';
import { handleDatasetDeleteFieldPatch } from '../formsLib/formHandlerDatasetPatch';
import { textType, licenseType } from '../../../schemaTypes';
// import { minLength } from '../../../validation/validation';

export const renderDistributionLandingpage = componentProps => {
  const { fields } = componentProps;
  return (
    <div>
      {fields &&
        fields.map((item, index) => (
          <Field
            key={index}
            name={`${item}.uri`}
            component={InputField}
            label={localization.schema.distribution.landingPageLabel}
          />
        ))}
    </div>
  );
};

export const renderDistributions = componentProps => {
  const {
    catalogId,
    datasetId,
    fields,
    openLicenseItems,
    initialValues,
    dispatch
  } = componentProps;
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
                <button
                  className="fdk-btn-no-border"
                  type="button"
                  title="Remove distribution"
                  onClick={() => {
                    handleDatasetDeleteFieldPatch(
                      catalogId,
                      datasetId,
                      'distribution',
                      fields,
                      index,
                      dispatch
                    );
                  }}
                >
                  <i className="fa fa-trash mr-2" />
                  {localization.schema.distribution.deleteDistributionLabel}
                </button>
              </div>
              <div className="form-group">
                <Helptext
                  title={localization.schema.distribution.helptext.type}
                  term="Distribution_type"
                />
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
              </div>
              <div className="form-group">
                <Helptext
                  title={localization.schema.distribution.helptext.accessURL}
                  term="Distribution_accessURL"
                />
                <Field
                  name={`${distribution}.accessURL.0`}
                  type="text"
                  component={InputField}
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
                  component={InputTagsField}
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
                  component={SelectField}
                  items={openLicenseItems}
                />
              </div>
              <div className="form-group">
                <Helptext
                  title={localization.schema.distribution.helptext.description}
                  term="Distribution_description"
                />
                <Field
                  name={`${distribution}.description.${localization.getLanguage()}`}
                  component={TextAreaField}
                  label={localization.schema.distribution.descriptionLabel}
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
                />
              </div>

              <div className="form-group">
                <Helptext
                  title={localization.schema.distribution.helptext.conformsTo}
                  term="Distribution_conformsTo"
                />
                <div className="d-flex">
                  <div className="w-50">
                    <Field
                      name={`${distribution}.conformsTo[0].prefLabel.${localization.getLanguage()}`}
                      component={InputField}
                      showLabel
                      label={localization.schema.common.titleLabel}
                    />
                  </div>
                  <div className="w-50">
                    <Field
                      name={`${distribution}.conformsTo[0].uri`}
                      component={InputField}
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
    </div>
  );
};

export const FormDistributionPure = props => {
  const { initialValues, dispatch, catalogId, datasetId } = props;
  const { openLicenseItems } = initialValues;
  return (
    <form>
      <FieldArray
        name="distribution"
        component={renderDistributions}
        openLicenseItems={openLicenseItems}
        initialValues={initialValues}
        dispatch={dispatch}
        catalogId={catalogId}
        datasetId={datasetId}
      />
    </form>
  );
};

FormDistributionPure.defaultProps = {
  initialValues: null,
  dispatch: null,
  catalogId: null,
  datasetId: null
};
FormDistributionPure.propTypes = {
  initialValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string
};
