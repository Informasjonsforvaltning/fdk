import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import SelectField from '../../../components/fields/field-select/field-select.component';
import TextAreaField from '../../../components/fields/field-textarea/field-textarea.component';
import InputFieldReadonly from '../../../components/fields/field-input-readonly/field-input-readonly.component';
import DatepickerField from '../../../components/fields/field-datepicker/field-datepicker.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';
import { getTranslateText } from '../../../services/translateText';

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

export const renderProvenanceReadOnly = componentProps => {
  const { input } = componentProps;
  return <div className="pl-3">{getTranslateText(input.value.prefLabel)}</div>;
};

export const renderProvenance = componentProps => {
  const { input, provenanceItems } = componentProps;
  let provenanceNodes;
  if (provenanceItems) {
    provenanceNodes = provenanceItems.map(provenanceItem => {
      if (provenanceItem.code) {
        const { code } = provenanceItem;
        return (
          <div key={code} className="form-check fdk-form-checkbox">
            <input
              type="checkbox"
              name="provenance"
              id={code}
              value={code}
              checked={
                input.value &&
                input.value.uri &&
                input.value.uri.includes(`${provenanceItem.uri}`)
                  ? 'checked'
                  : ''
              }
              onChange={e =>
                handleProvenanceChange(componentProps, e, provenanceItem)
              }
            />
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label,jsx-a11y/label-has-associated-control */}
            <label
              className="form-check-label fdk-form-check-label"
              htmlFor={code}
            />
            <span>
              {provenanceItem.prefLabel[localization.getLanguage()] ||
                provenanceItem.prefLabel.no ||
                provenanceItem.prefLabel.nb}
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

const requenzyReadOnly = ({ input }) => {
  return <div className="pl-3">{getTranslateText(input.value.prefLabel)}</div>;
};
requenzyReadOnly.defaultProps = {
  input: null
};
requenzyReadOnly.propTypes = {
  input: PropTypes.object
};
const lastUpdateReadOnly = ({ input }) => {
  return <div className="pl-3">{input.value}</div>;
};
lastUpdateReadOnly.defaultProps = {
  input: null
};
lastUpdateReadOnly.propTypes = {
  input: PropTypes.object
};
export const FormProvenance = ({ initialValues, languages }) => {
  const {
    provenance,
    provenanceItems,
    frequencyItems,
    isReadOnly
  } = initialValues;
  if (provenance) {
    return (
      <form>
        <div className="form-group">
          <Helptext
            title={localization.schema.provenance.helptext.provenance}
            term="Dataset_provenance"
          />
          <Field
            name="provenance"
            component={isReadOnly ? renderProvenance : renderProvenanceReadOnly}
            provenanceItems={provenanceItems}
          />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.provenance.helptext.accruralPeriodicity}
            term="Dataset_accruralPeriodicity"
          />
          <Field
            name="accrualPeriodicity"
            component={isReadOnly ? SelectField : requenzyReadOnly}
            items={frequencyItems}
          />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.provenance.helptext.modified}
            term="Dataset_modified"
          />
          <Field
            name="modified"
            type="text"
            component={isReadOnly ? DatepickerField : lastUpdateReadOnly}
            label={localization.schema.provenance.modifiedLabel}
          />
        </div>
        <div className="form-group">
          <Helptext
            title={localization.schema.provenance.helptext.currentness}
            term="Dataset_hasQualityAnnotation_currentness"
          />
          <MultilingualField
            name="hasCurrentnessAnnotation.hasBody"
            component={isReadOnly ? TextAreaField : InputFieldReadonly}
            label={localization.schema.provenance.hasCurrentnessAnnotationLabel}
            languages={languages}
          />
        </div>
      </form>
    );
  }
  return null;
};

FormProvenance.defaultProps = {
  initialValues: null,
  languages: [],
  isReadOnly: false
};

FormProvenance.propTypes = {
  initialValues: PropTypes.object,
  languages: PropTypes.array,
  isReadOnly: PropTypes.bool
};
