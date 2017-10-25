import * as React from 'react';

export class RefinementOptionThemes extends React.Component {
  render() {
    const { bemBlocks, itemKey, label, active, onClick, count } = this.props; // eslint-disable-line react/prop-types
    let themeLabel = '';
    if (window.themes.length > 0) {
      if (label === 'Ukjent') {
        themeLabel = label;
      } else {
        themeLabel = _.find(window.themes, label.substr(-4))[label.substr(-4)]['nb'];
      }
    }
    const id = encodeURIComponent((itemKey + Math.random()));
    return (
      <div className="checkbox">
        <label htmlFor="themes">
          <input
            type="checkbox"
            id={id}
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
