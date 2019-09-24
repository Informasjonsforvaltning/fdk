import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

const MultilingualField = ({ name, component, languages, label }) =>
  languages.map(({ code, selected }) => {
    const isOnlyOneSelectedLanguage =
      languages.filter(({ selected }) => selected).length === 1;

    return (
      selected && (
        <Field
          key={code}
          name={`${name}.${code}`}
          label={`${label}.${code}`}
          component={component}
          language={code}
          isOnlyOneSelectedLanguage={isOnlyOneSelectedLanguage}
        />
      )
    );
  });

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
