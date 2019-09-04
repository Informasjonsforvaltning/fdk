import React from 'react';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';
import TextAreaField from '../../../components/field-textarea/field-textarea.component';

export const renderLandingpage = componentProps => (
  <div>
    {componentProps.fields.map((item, index) => (
      <Field
        key={index}
        name={`${item}`}
        component={InputField}
        label="Landingsside"
      />
    ))}
  </div>
);

export const FormTitle = ({ languages }) => (
  <form>
    <div className="form-group">
      <Helptext
        title={localization.schema.title.helptext.title}
        required
        term="Dataset_title"
      />
      <MultilingualField
        name="title"
        component={InputField}
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
        component={TextAreaField}
        languages={languages}
        label={localization.schema.title.descriptionLabel}
      />
    </div>
    <div className="form-group">
      <Helptext
        title={localization.schema.title.helptext.objective}
        term="Dataset_objective"
      />
      <Field
        name={`objective.${localization.getLanguage()}`}
        component={TextAreaField}
        label={localization.schema.title.objectiveLabel}
      />
    </div>

    <div className="form-group">
      <Helptext
        title={localization.schema.title.helptext.landingPage}
        term="Dataset_landingpage"
      />
      <FieldArray name="landingPage" component={renderLandingpage} />
    </div>
  </form>
);
