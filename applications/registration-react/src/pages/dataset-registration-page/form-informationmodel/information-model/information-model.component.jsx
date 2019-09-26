import React from 'react';
import { Field } from 'redux-form';

import localization from '../../../../lib/localization';
import InputField from '../../../../components/fields/field-input/field-input.component';

const InformationModel = ({ fields, titleLabel, linkLabel }) =>
  fields &&
  fields.map((item, index) => (
    <div className="d-flex mb-5" key={index}>
      <div className="w-50">
        <Field
          name={`${item}.prefLabel.${localization.getLanguage()}`}
          component={InputField}
          label={titleLabel}
          showLabel
        />
      </div>
      <div className="w-50">
        <Field
          name={`${item}.uri`}
          component={InputField}
          label={linkLabel}
          showLabel
        />
      </div>
    </div>
  ));

export default InformationModel;
