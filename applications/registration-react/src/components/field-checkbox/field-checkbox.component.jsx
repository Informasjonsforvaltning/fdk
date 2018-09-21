import React from 'react';
import PropTypes from 'prop-types';

import './field-checkbox.scss';

const handleChangeLang = (props, event) => {
  const { input } = props;
  // Skal fjerne fra array
  if (!event.target.checked) {
    const newInput = input.value.filter(
      returnableObjects => returnableObjects.code !== event.target.value
    );
    input.onChange(newInput);
  } else {
    // Skal legge til array
    let updates = [];
    updates = input.value.map(item => ({
      uri: item.uri,
      code: item.code
    }));
    if (event.target.value === 'NOR') {
      updates.push({
        uri: 'http://publications.europa.eu/resource/authority/language/NOR',
        code: 'NOR',
        prefLabel: {
          nb: 'Norsk'
        }
      });
    } else if (event.target.value === 'ENG') {
      updates.push({
        uri: 'http://publications.europa.eu/resource/authority/language/ENG',
        code: 'ENG',
        prefLabel: {
          nb: 'Engelsk'
        }
      });
    } else if (event.target.value === 'SMI') {
      updates.push({
        uri: 'http://publications.europa.eu/resource/authority/language/SMI',
        code: 'SMI',
        prefLabel: {
          nb: 'Samisk'
        }
      });
    }
    input.onChange(updates);
  }
};

const CheckboxField = props => {
  const { input, label } = props;

  let langCodes = [];

  if (input.value && input.value.length > 0) {
    langCodes = input.value.map(item => item.code);
  }

  return (
    <div>
      <label className="form-check fdk-form-checkbox" htmlFor="ENG">
        <input
          type="checkbox"
          name="language"
          id="ENG"
          value="ENG"
          checked={langCodes.includes('ENG') ? 'checked' : ''}
          onChange={e => handleChangeLang(props, e)}
        />
        <span className="form-check-label fdk-form-check-label" />
        <span>Engelsk</span>
      </label>
      <label className="form-check fdk-form-checkbox" htmlFor="NOR">
        <input
          type="checkbox"
          name="language"
          id="NOR"
          value="NOR"
          checked={langCodes.includes('NOR') ? 'checked' : ''}
          onChange={e => handleChangeLang(props, e)}
        />
        <span className="form-check-label fdk-form-check-label" />
        <span>Norsk</span>
      </label>
      <label className="form-check fdk-form-checkbox" htmlFor="SMI">
        <input
          type="checkbox"
          name="language"
          id="SMI"
          value="SMI"
          checked={langCodes.includes('SMI') ? 'checked' : ''}
          onChange={e => handleChangeLang(props, e)}
        />
        <span className="form-check-label fdk-form-check-label" />
        <span>Samisk</span>
      </label>
    </div>
  );
};

CheckboxField.defaultProps = {
  input: {
    value: []
  },
  label: null
};

CheckboxField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string
};

export default CheckboxField;
