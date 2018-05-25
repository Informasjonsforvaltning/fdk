import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

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
          title="Tittel"
          required
          helptextItems={helptextItems.Dataset_title}
        />
        <Field name="title.nb" component={InputField} label="Tittel" />
      </div>
      <div className="form-group">
        <Helptext
          title="Beskrivelse av datasettet"
          required
          helptextItems={helptextItems.Dataset_description}
        />
        <Field
          name="description.nb"
          component={TextAreaField}
          label="Beskrivelse"
        />
      </div>
      <div className="form-group">
        <Helptext
          title="Formålet med datasettet"
          helptextItems={helptextItems.Dataset_objective}
        />
        <Field name="objective.nb" component={TextAreaField} label="Formål" />
      </div>

      <div className="form-group">
        <Helptext
          title="Lenke til mer informasjon om datasettet"
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
