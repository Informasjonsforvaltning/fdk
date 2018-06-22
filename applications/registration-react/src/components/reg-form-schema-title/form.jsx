import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import TextAreaField from '../reg-form-field-textarea';

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

const FormTitle = props => {
  const { helptextItems } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext
          title={localization.schema.title.helptext.title}
          required
          helptextItems={helptextItems.Dataset_title}
        />
        <Field
          name={`title.${localization.getLanguage()}`}
          component={InputField}
          label={localization.schema.title.titleLabel}
        />
      </div>
      <div className="form-group">
        <Helptext
          title={localization.schema.title.helptext.description}
          required
          helptextItems={helptextItems.Dataset_description}
        />
        <Field
          name={`description.${localization.getLanguage()}`}
          component={TextAreaField}
          label={localization.schema.title.descriptionLabel}
        />
      </div>
      <div className="form-group">
        <Helptext
          title={localization.schema.title.helptext.objective}
          helptextItems={helptextItems.Dataset_objective}
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
          helptextItems={helptextItems.Dataset_landingpage}
        />
        <FieldArray
          name="landingPage"
          component={renderLandingpage}
          helptextItems={helptextItems}
        />
      </div>
    </form>
  );
};

FormTitle.propTypes = {
  helptextItems: PropTypes.object.isRequired
};

export default FormTitle;
