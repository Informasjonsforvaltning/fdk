import * as React from 'react';

export class RefinementOptionThemes extends React.Component {
  render() {
    const props = this.props;
    let themeLabel = '';
		  const {
		    bemBlocks, onClick, active, disabled, style, itemKey,
		    label, count, showCount, showCheckbox } = props;
    if (window.themes.length > 0) {
      themeLabel = _.find(window.themes, props.label.substr(-4))[props.label.substr(-4)];
    }
    const block = bemBlocks.option;
		  const className = block()
		    .state({ active, disabled })
		    .mix(bemBlocks.container('item'));
    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            checked={props.active}
            onChange={props.onClick}
            className={`${props.bemBlocks.option().state({ active: props.active })} list-group-item fdk-label fdk-label-default`}
          />
          {themeLabel} ({props.count})
        </label>
      </div>
    );
  }
}
