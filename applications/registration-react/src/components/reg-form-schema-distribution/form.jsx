import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import InputTagsField from '../reg-form-field-input-tags';
import TextAreaField from '../reg-form-field-textarea';
import RadioField from '../reg-form-field-radio';
import SelectField from '../reg-form-field-select';
import asyncValidate from '../../utils/asyncValidate';
import { textType, licenseType } from '../../schemaTypes';

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
            label="Landingsside"
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
                Slett distribusjon
              </button>
            </div>
            <div className="form-group">
              <Helptext
                title="Type"
                helptextItems={helptextItems.Dataset_distribution}
              />
              <Field
                name={`${distribution}.type`}
                radioId={`distribution-api-${index}`}
                component={RadioField}
                type="radio"
                value="API"
                label="API"
              />
              <Field
                name={`${distribution}.type`}
                radioId={`distribution-feed-${index}`}
                component={RadioField}
                type="radio"
                value="Feed"
                label="Feed"
              />
              <Field
                name={`${distribution}.type`}
                radioId={`distribution-file-${index}`}
                component={RadioField}
                type="radio"
                value="Nedlastbar fil"
                label="Nedlastbar fil"
              />
            </div>
            <div className="form-group">
              <Helptext
                title="Tilgangslenke"
                helptextItems={helptextItems.Distribution_accessURL}
              />
              <Field
                name={`${distribution}.accessURL.0`}
                type="text"
                component={InputField}
                label="Tilgangslenke"
              />
            </div>
            <div className="form-group">
              <Helptext
                title="Format"
                helptextItems={helptextItems.Distribution_format}
              />
              <Field
                name={`${distribution}.format`}
                type="text"
                component={InputTagsField}
                label="Format"
              />
            </div>
            <div className="form-group">
              <Helptext
                title="Lisens"
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
                title="Beskrivelse"
                helptextItems={helptextItems.Distribution_description}
              />
              <Field
                name={`${distribution}.description.nb`}
                component={TextAreaField}
                label="Beskrivelse"
              />
            </div>

            <div className="form-group">
              <Helptext
                title="Lenke til dokumentasjon av distribusjonen"
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
                title="Standard"
                helptextItems={helptextItems.Distribution_conformsTo}
              />
              <div className="d-flex">
                <div className="w-50">
                  <Field
                    name={`${distribution}.conformsTo[0].prefLabel.nb`}
                    component={InputField}
                    showLabel
                    label="Tittel"
                  />
                </div>
                <div className="w-50">
                  <Field
                    name={`${distribution}.conformsTo[0].uri`}
                    component={InputField}
                    showLabel
                    label="Lenke"
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
        Legg til distribusjon
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

export default FormDistribution;
