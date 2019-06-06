import React from 'react';
import PropTypes from 'prop-types';
import _capitalize from 'lodash/capitalize';

import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';

export const FilterOption = props => {
  const {
    itemKey,
    value,
    labelRaw,
    label,
    count,
    onClick,
    active,
    themesItems,
    displayClass
  } = props;
  const optionLabel = labelRaw || label;

  let textLabel;
  // if themes, then choose text from themes array, else choose label from localization-file.
  if (themesItems) {
    if (themesItems[`${label}`]) {
      textLabel = getTranslateText(themesItems[`${label}`].title);
    } else {
      textLabel = localization.unknown;
    }
  } else if (
    optionLabel.toUpperCase() === 'UKJENT' ||
    optionLabel.toUpperCase() === 'MISSING'
  ) {
    textLabel = localization.unknown;
  } else {
    textLabel = localization[optionLabel] || optionLabel;
  }
  if (textLabel && textLabel === textLabel.toUpperCase()) {
    textLabel =
      localization[textLabel.toLowerCase()] || `${_capitalize(textLabel)}`;
  }

  const id = encodeURIComponent(itemKey + value);

  let inputRef;

  return (
    <div className={`checkbox ${displayClass}`}>
      <label
        className="checkbox_label"
        onKeyPress={() => {
          inputRef.click();
        }}
        tabIndex="0"
        role="button"
        htmlFor={id}
      >
        <input
          ref={input => {
            inputRef = input;
          }}
          type="checkbox"
          id={id}
          tabIndex="-1"
          checked={active}
          onChange={e => onClick(e)}
          className="list-group-item fdk-label fdk-label-default"
          value={value}
        />
        <span className="checkbox-replacement" />
        {textLabel} ({count})
      </label>
    </div>
  );
};

FilterOption.defaultProps = {
  value: null,
  labelRaw: null,
  label: null,
  count: null,
  active: null,
  themesItems: null,
  displayClass: null
};

FilterOption.propTypes = {
  itemKey: PropTypes.number.isRequired,
  value: PropTypes.string,
  labelRaw: PropTypes.string,
  label: PropTypes.string,
  count: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
  themesItems: PropTypes.object,
  displayClass: PropTypes.string
};
