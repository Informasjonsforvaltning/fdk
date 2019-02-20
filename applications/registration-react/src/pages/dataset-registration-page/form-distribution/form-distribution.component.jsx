import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';
import InputTagsField from '../../../components/field-input-tags/field-input-tags.component';
import TextAreaField from '../../../components/field-textarea/field-textarea.component';
import RadioField from '../../../components/field-radio/field-radio.component';
import SelectField from '../../../components/field-select/field-select.component';
import asyncValidate from '../../../lib/asyncValidate';
import { textType, licenseType } from '../../../schemaTypes';

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
  const { fields, helptextItems, openLicenseItems } = componentProps;
  return (
    <div>
      {fields &&
        fields.map((distribution, index) => (
          <div key={index}>
            <div className="d-flex">
              <h4>Distribusjon #{index + 1}</h4>
              <button
                className="fdk-btn-no-border"
                type="button"
                title="Remove distribution"
                onClick={() => {
                  fields.remove(index);
                  asyncValidate(
                    fields.getAll(),
                    null,
                    componentProps,
                    `remove_distribution_${index}`
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
                helptextItems={helptextItems.Distribution_type}
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
                helptextItems={helptextItems.Distribution_accessURL}
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
                helptextItems={helptextItems.Distribution_format}
              />
              <Field
                name={`${distribution}.format`}
                type="text"
                component={InputTagsField}
                label={localization.schema.distribution.formatLabel}
              />
            </div>
            <div className="form-group">
              <Helptext
                title={localization.schema.distribution.helptext.license}
                helptextItems={helptextItems.Distribution_modified}
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
                helptextItems={helptextItems.Distribution_description}
              />
              <Field
                name={`${distribution}.description.${localization.getLanguage()}`}
                component={TextAreaField}
                label={localization.schema.distribution.descriptionLabel}
              />
            </div>

            <div className="form-group">
              <Helptext
                title={localization.schema.distribution.helptext.documentation}
                helptextItems={helptextItems.Distribution_documentation}
              />
              <FieldArray
                name={`${distribution}.page`}
                component={renderDistributionLandingpage}
                helptextItems={helptextItems}
              />
            </div>

            <div className="form-group">
              <Helptext
                title={localization.schema.distribution.helptext.conformsTo}
                helptextItems={helptextItems.Distribution_conformsTo}
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
        ))}
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

export const FormDistribution = props => {
  const { helptextItems, initialValues } = props;
  const { openLicenseItems } = initialValues;
  return (
    <form>
      <FieldArray
        name="distribution"
        component={renderDistributions}
        helptextItems={helptextItems}
        openLicenseItems={openLicenseItems}
      />
    </form>
  );
};

FormDistribution.defaultProps = {
  initialValues: null
};
FormDistribution.propTypes = {
  initialValues: PropTypes.object.isRequired,
  helptextItems: PropTypes.object.isRequired
};
