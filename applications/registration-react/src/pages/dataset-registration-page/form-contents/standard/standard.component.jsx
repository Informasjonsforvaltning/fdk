import { Field } from 'redux-form';
import React from 'react';
import PropTypes from 'prop-types';
import InputField from '../../../../components/field-input/field-input.component';
import localization from '../../../../lib/localization';

export const Standard = ({ fields, titleLabel, linkLabel }) => (
  <div>
    {fields &&
      fields.map((item, index) => (
        <div className="d-flex flex-column mb-5" key={index}>
          <Field
            name={`${item}.prefLabel.${localization.getLanguage()}`}
            component={InputField}
            label={titleLabel}
            showLabel
          />
          <div className="mt-2">
            <Field
              name={`${item}.uri`}
              component={InputField}
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
  linkLabel: PropTypes.string.isRequired
};
