import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import localization from '../../../utils/localization';
import Helptext from '../../../components/helptext/helptext.component';
import SelectField from '../../../components/field-select/field-select.component';
import TextAreaField from '../../../components/field-textarea/field-textarea.component';
import DatepickerField from '../../../components/field-datepicker/field-datepicker.component';

const handleProvenanceChange = (componentProps, event, provenanceItem) => {
  const { input } = componentProps;

  // Skal fjerne fra array
  if (!event.target.checked) {
    input.onChange(null);
  } else {
    // Skal legge til array
    input.onChange(provenanceItem);
  }
};

export const renderProvenance = componentProps => {
  const { input, label, provenanceItems } = componentProps;
  let provenanceNodes;
  if (provenanceItems) {
    provenanceNodes = Object.keys(provenanceItems).map(key => {
      if (provenanceItems[key].code) {
        const { code } = provenanceItems[key];
        return (
          <div key={key} className="form-check fdk-form-checkbox">
            <input
              type="checkbox"
              name="provenance"
              id={provenanceItems[key].code}
              value={provenanceItems[key].code}
              checked={
                input.value &&
                input.value.uri &&
                input.value.uri.includes(`${provenanceItems[key].uri}`)
                  ? 'checked'
                  : ''
              }
              onChange={e =>
                handleProvenanceChange(componentProps, e, provenanceItems[code])
              }
            />
            {/* eslint-disable jsx-a11y/label-has-for */}
            <label
              className="form-check-label fdk-form-check-label"
              htmlFor={provenanceItems[key].code}
            />
            {/* eslint-enable jsx-a11y/label-has-for */}
            <span>
              {provenanceItems[key].prefLabel[localization.getLanguage()] ||
                provenanceItems[key].prefLabel.no ||
                provenanceItems[key].prefLabel.nb}
            </span>
          </div>
        );
      }
      return null;
    });
    return provenanceNodes;
  }
  return null;
};

export const FormProvenance = props => {
  const { helptextItems, initialValues } = props;
  const { provenance, provenanceItems, frequencyItems } = initialValues;
  if (provenance) {
    return (
      <form>
        <div className="form-group">
          <Helptext
            title={localization.schema.provenance.helptext.provenance}
            helptextItems={helptextItems.Dataset_provenance}
          />
          <Field
            name="provenance"
            component={renderProvenance}
            provenanceItems={provenanceItems}
          />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.provenance.helptext.accruralPeriodicity}
            helptextItems={helptextItems.Dataset_accruralPeriodicity}
          />
          <Field
            name="accrualPeriodicity"
            component={SelectField}
            items={frequencyItems}
          />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.provenance.helptext.modified}
            helptextItems={helptextItems.Dataset_modified}
          />
          <Field
            name="modified"
            type="text"
            component={DatepickerField}
            label={localization.schema.provenance.modifiedLabel}
          />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.provenance.helptext.currentness}
            helptextItems={
              helptextItems.Dataset_hasQualityAnnotation_currentness
            }
          />
          <Field
            name={`hasCurrentnessAnnotation.hasBody.${localization.getLanguage()}`}
            component={TextAreaField}
            label={localization.schema.provenance.hasCurrentnessAnnotationLabel}
          />
        </div>
      </form>
    );
  }
  return null;
};

FormProvenance.defaultProps = {
  initialValues: null
};

FormProvenance.propTypes = {
  initialValues: PropTypes.object,
  helptextItems: PropTypes.object.isRequired
};
