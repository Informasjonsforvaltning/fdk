import * as React from 'react';
import localization from '../../components/localization';

export class RefinementOptionThemes extends React.Component {
  render() {
    const { bemBlocks, itemKey, label, active, onClick, count } = this.props; // eslint-disable-line react/prop-types
    let themeLabel = '';
    if (window.themes.length > 0) {
      if (label === 'Ukjent') {
        themeLabel = label;
      } else {
        let lang = localization.getLanguage();
        themeLabel = _.find(window.themes, label.substr(-4))[label.substr(-4)][lang];
      }
    }
    const id = encodeURIComponent((itemKey + Math.random()));
    return (
      <div className="checkbox">
        <label onKeyPress={onClick} tabIndex="1" htmlFor={id}>
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
}
