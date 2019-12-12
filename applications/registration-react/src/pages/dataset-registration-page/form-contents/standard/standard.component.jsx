import { Field } from 'redux-form';
import React from 'react';
import PropTypes from 'prop-types';
import InputField from '../../../../components/fields/field-input/field-input.component';
import MultilingualField from '../../../../components/multilingual-field/multilingual-field.component';
import LinkReadonlyField from '../../../../components/fields/field-link-readonly/field-link-readonly.component';
import InputFieldReadonly from '../../../../components/fields/field-input-readonly/field-input-readonly.component';

export const Standard = ({
  fields,
  titleLabel,
  linkLabel,
  languages,
  isReadOnly
}) => (
  <div>
    {fields &&
      fields.map((item, index) => (
        <div className="d-flex flex-column mb-5" key={index}>
          <MultilingualField
            name={`${item}.prefLabel`}
            component={isReadOnly ? InputFieldReadonly : InputField}
            label={titleLabel}
            showLabel
            languages={languages}
          />
          <div className="mt-2">
            <Field
              name={`${item}.uri`}
              component={isReadOnly ? LinkReadonlyField : InputField}
              label={linkLabel}
              showLabel
            />
          </div>
        </div>
      ))}
  </div>
);

Standard.propTypes = {
  fields: PropTypes.object.isRequired,
  titleLabel: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
  languages: PropTypes.array.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};
