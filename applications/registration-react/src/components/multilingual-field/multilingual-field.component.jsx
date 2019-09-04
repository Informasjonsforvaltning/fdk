import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

const MultilingualField = ({ name, component, languages, label }) =>
  languages.map(language => (
    <Field
      key={language}
      name={`${name}.${language}`}
      label={`${label}.${language}`}
      component={component}
      language={language}
    />
  ));

MultilingualField.defaultProps = {
  name: null,
  label: null,
  component: null,
  languages: []
};

MultilingualField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  component: PropTypes.func,
  languages: PropTypes.array
};

export default MultilingualField;
