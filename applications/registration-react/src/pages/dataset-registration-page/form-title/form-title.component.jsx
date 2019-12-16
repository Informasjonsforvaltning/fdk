import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../services/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/fields/field-input/field-input.component';
import LinkReadonlyField from '../../../components/fields/field-link-readonly/field-link-readonly.component';
import InputFieldReadonly from '../../../components/fields/field-input-readonly/field-input-readonly.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';
import TextAreaField from '../../../components/fields/field-textarea/field-textarea.component';

export const renderLandingpage = componentProps => (
  <div>
    {componentProps.fields.map((item, index) => (
      <Field
        key={index}
        name={`${item}`}
        component={componentProps.isReadOnly ? LinkReadonlyField : InputField}
        label="Landingsside"
      />
    ))}
  </div>
);

export const FormTitle = ({ languages, isReadOnly }) => (
  <form>
    <div className="form-group">
      <Helptext
        title={localization.schema.title.helptext.title}
        required
        term="Dataset_title"
      />
      <MultilingualField
        name="title"
        component={isReadOnly ? InputFieldReadonly : InputField}
        languages={languages}
        label={localization.schema.title.titleLabel}
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.title.helptext.description}
        required
        term="Dataset_description"
      />
      <MultilingualField
        name="description"
        component={isReadOnly ? InputFieldReadonly : TextAreaField}
        languages={languages}
        label={localization.schema.title.descriptionLabel}
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.title.helptext.objective}
        term="Dataset_objective"
        required
      />
      <MultilingualField
        name="objective"
        component={isReadOnly ? InputFieldReadonly : TextAreaField}
        label={localization.schema.title.objectiveLabel}
        languages={languages}
      />
    </div>

    <div className="form-group">
      <Helptext
        title={localization.schema.title.helptext.landingPage}
        term="Dataset_landingpage"
      />
      <FieldArray
        name="landingPage"
        isReadOnly={isReadOnly}
        component={renderLandingpage}
      />
    </div>
  </form>
);

FormTitle.defaultProps = {
  languages: [],
  isReadOnly: false
};

FormTitle.propTypes = {
  languages: PropTypes.array,
  isReadOnly: PropTypes.bool
};
