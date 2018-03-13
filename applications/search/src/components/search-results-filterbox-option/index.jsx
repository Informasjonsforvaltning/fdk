import React from 'react';
import localization from '../../components/localization';
import { getTranslateText } from '../../utils/translateText';

const FilterOption = (props) => {
  const {
    itemKey, label, count, onClick, active, themesItems
  } = props;

  const optionLabel = `${label.charAt(0)}${label.substring(1).toLowerCase()}`;

  let textLabel;
  // if themes, then choose text from themes array, else choose label from localization-file.
  if (themesItems) {
    if (themesItems[`${label}`]) {
      textLabel = getTranslateText(themesItems[`${label}`].title, localization.getLanguage());
    } else {
      textLabel = localization.search_hit.ukjent
    }
  } else {
    textLabel = localization.search_hit[optionLabel.toLowerCase()] ? localization.search_hit[optionLabel.toLowerCase()] : optionLabel;
  }

  const id = encodeURIComponent((itemKey + Math.random()));

  return (
    <div className="checkbox">
      {
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      }<label tabIndex="0" role="button" htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          tabIndex="-1"
          checked={active}
          onChange={(e) => onClick(e)}
          className={`list-group-item fdk-label fdk-label-default`}
          value={label}
        />
        <label className="checkbox-replacement" htmlFor={id} />
        {textLabel} ({count})
      </label>
    </div>
  );
}
export default FilterOption;
