import React from 'react';
import _find from 'lodash/find';

import localization from '../../components/localization';

const RefinementOptionThemes = (props) => {
  const { bemBlocks, itemKey, label, active, onClick, count } = props; // eslint-disable-line react/prop-types
  let themeLabel = '';
  if (window.themes.length > 0) {
    if (label === 'Ukjent') {
      themeLabel = localization.search_hit.ukjent;
    } else {
      const lang = localization.getLanguage();
      if(_find(window.themes, label.substr(-4))) {
        themeLabel = _find(window.themes, label.substr(-4))[label.substr(-4)][lang];
      } else if(label === 'showmorelabel') {
        themeLabel = label;
        return (
          <label htmlFor="showAllThemesToggle" >{localization.facet.showmore}</label>
        )
      } else if(label === 'showfewerlabel') {
        return (
          <label htmlFor="showAllThemesToggle" >{localization.facet.showfewer}</label>
        )
      } else if(label === 'showmoreinput') {
        return (
          <input type="checkbox" id="showAllThemesToggle"  />
        )

      }
    }
  }
  const id = encodeURIComponent((itemKey + Math.random()));
  return (
    <div className="checkbox">
      {
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      }<label onKeyPress={onClick} tabIndex="0" htmlFor={id} role="button">
        <input
          type="checkbox"
          id={id}
          tabIndex="-1"
          checked={active}
          onChange={onClick}
          className={`${bemBlocks.option().state({ active })} list-group-item fdk-label fdk-label-default`}
        />
        <label className="checkbox-replacement" htmlFor={id} />
        {themeLabel} ({count})
      </label>
    </div>
  );
}

export default RefinementOptionThemes;
