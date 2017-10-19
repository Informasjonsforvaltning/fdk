import * as React from 'react';


export class RefinementOptionPublishers extends React.Component {
  render() {
    const props = this.props;
		  const {
		    bemBlocks, onClick, active, disabled, style, itemKey,
		    label, count, showCount, showCheckbox } = props;
    const block = bemBlocks.option;
		  const className = block()
		    .state({ active, disabled })
		    .mix(bemBlocks.container('item'));

    let optionLabel;
    if (props.label !== 'Ukjent') {
      optionLabel = `${props.label.charAt(0)}${props.label.substring(1).toLowerCase()}`;
    } else { optionLabel = props.label; }
    const id = encodeURIComponent(itemKey);
    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            id={id}
            checked={active}
            onChange={onClick}
            className={`${bemBlocks.option().state({ active: active }).mix(bemBlocks.container('item'))
            } list-group-item fdk-label fdk-label-default`}
          />
          <label className="checkbox-replacement" htmlFor={id}></label>
          {optionLabel} ({props.count})
        </label>
      </div>
    );
  }
}
