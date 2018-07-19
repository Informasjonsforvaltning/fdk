import React from 'react';
import PropTypes from 'prop-types';
import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';

export const FilterOption = props => {
  const {
    itemKey,
    value,
    label,
    count,
    onClick,
    active,
    themesItems,
    displayClass
  } = props;

  const optionLabel = `${label.charAt(0)}${label.substring(1).toLowerCase()}`;

  let textLabel;
  // if themes, then choose text from themes array, else choose label from localization-file.
  if (themesItems) {
    if (themesItems[`${label}`]) {
      textLabel = getTranslateText(themesItems[`${label}`].title);
    } else {
      textLabel = localization.search_hit.ukjent;
    }
  } else {
    textLabel = localization.search_hit[optionLabel.toLowerCase()]
      ? localization.search_hit[optionLabel.toLowerCase()]
      : optionLabel;
  }

  const id = encodeURIComponent(itemKey + value);

  let inputRef;

  return (
    <div className={`checkbox ${displayClass}`}>
      {/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */}
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
          className={`list-group-item fdk-label fdk-label-default`}
          value={value}
        />
        <span className="checkbox-replacement" />
        {textLabel} ({count})
      </label>
      {/* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */}
    </div>
  );
};

FilterOption.defaultProps = {
  value: null,
  label: null,
  count: null,
  onClick: null,
  active: null,
  themesItems: null,
  displayClass: null
};

FilterOption.propTypes = {
  itemKey: PropTypes.number.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  count: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
  themesItems: PropTypes.object,
  displayClass: PropTypes.string
};
