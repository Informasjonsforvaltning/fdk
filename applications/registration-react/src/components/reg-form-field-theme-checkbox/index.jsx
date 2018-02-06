import React from 'react';
import PropTypes from 'prop-types';

const handleChange = (props, event) => {
  const { input } = props;
  const selectedItemURI = event.target.value;
  props.meta.touched.true;

  // Skal fjerne fra array
  if (!event.target.checked) {
    const newInput = input.value.filter((returnableObjects) => returnableObjects.uri !== selectedItemURI);
    input.onChange(newInput);
  } else { // add object
    let updates = [];
    updates = input.value.map((item) => (
      item
    ));
    const selectedThemeItem = props.themesItems.find(item => item.id === selectedItemURI);
    const addItem = {
      "value": selectedThemeItem.id,
      "label": selectedThemeItem.title.nb,
      "title": {
        "nb": selectedThemeItem.title.nb
      },
      "uri": selectedThemeItem.id
    };
    updates.push(addItem);
    input.onChange(updates);
  }
}

const CheckboxFieldTheme = (props) => {
  const { input, label, themesItems } = props;
  let themeCodes = [];
  if (input.value && input.value.length > 0) {
    themeCodes = input.value.map(item => item.uri);
  }

  return (
    <div>
      {themesItems.map((theme, index) => (
        <div key={index} className="form-check fdk-form-checkbox">
          <input type="checkbox" name="themes" id={theme.id} value={theme.id} checked={themeCodes.includes(theme.id) ? 'checked' : ''} onChange={(e) => {handleChange(props, e)}} />
          <label className="form-check-label fdk-form-check-label" htmlFor={theme.id} />
          <span>{theme.title.nb}</span>
        </div>
      ))}
    </div>
  );
}

CheckboxFieldTheme.defaultProps = {

};

CheckboxFieldTheme.propTypes = {

};

export default CheckboxFieldTheme;
