import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const handleChange = (props, event) => {
  let { input } = props;
  props.meta.touched.true;
  // Skal fjerne fra array
  if (!event.target.checked) {
    const newInput = input.value.filter(function (returnableObjects) {
      return returnableObjects.code !== event.target.value;
    });

    input.onChange(newInput);
  }
  // Skal legge til array
  else {
    let updates = [];
    updates = input.value.map((item) => {
      return (
        {
          "uri": item.uri,
          "code": item.code
        }
      );
    });
    if (event.target.value === 'NOR') {
      updates.push({
        uri: "http://publications.europa.eu/resource/authority/language/NOR",
        code: 'NOR',
        prefLabel: {
          nb: 'Norsk'
        }
      });
    } else if (event.target.value === 'ENG') {
      updates.push({
        uri: "http://publications.europa.eu/resource/authority/language/ENG",
        code: 'ENG',
        prefLabel: {
          nb: 'Engelsk'
        }
      });
    } else if (event.target.value === 'SMI') {
      updates.push({
        uri: "http://publications.europa.eu/resource/authority/language/SMI",
        code: 'SMI',
        prefLabel: {
          nb: 'Samisk'
        }
      });
    }
    input.onChange(updates);
  }
}

const CheckboxField = (props) => {
  console.log("INN HER");
  const { input, label, type, meta: { touched, error, warning }, prefLabel, name, code } = props;
  console.log("input", JSON.stringify(input));

  let langCodes = [];

  if (input.value && input.value.length > 0) {
    console.log("codes length", input.value.length);
    langCodes = input.value.map(item => {
      return item.code
    });
  }
  console.log("langCodes", JSON.stringify(langCodes));

  return (
    <div>
      <div className="form-check fdk-form-checkbox">
        <input type="checkbox" name="language" id="ENG" value="ENG"  checked={langCodes.includes('ENG') ? 'checked' : ''} onChange={(e) => handleChange(props, e)}/>
        <label className="form-check-label fdk-form-check-label" htmlFor="ENG" />
        <span>Engelsk</span>
      </div>
      <div className="form-check fdk-form-checkbox">
        <input type="checkbox" name="language" id="NOR" value="NOR"  checked={langCodes.includes('NOR') ? 'checked' : ''} onChange={(e) => handleChange(props, e)}/>
        <label className="form-check-label fdk-form-check-label" htmlFor="NOR" />
        <span>Norsk</span>
      </div>
      <div className="form-check fdk-form-checkbox">
        <input type="checkbox" name="language" id="SMI" value="SMI"  checked={langCodes.includes('SMI') ? 'checked' : ''} onChange={(e) => handleChange(props, e)}/>
        <label className="form-check-label fdk-form-check-label" htmlFor="SMI" />
        <span>Samisk</span>
      </div>
    </div>
  );
}

CheckboxField.defaultProps = {

};

CheckboxField.propTypes = {

};

export default CheckboxField;
