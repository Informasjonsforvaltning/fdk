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

    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            checked={props.active}
            onChange={props.onClick}
            className={`${props.bemBlocks.option().state({ active: props.active }).mix(props.bemBlocks.container('item'))
            } list-group-item fdk-label fdk-label-default`}
          />
          {props.label.charAt(0)}{props.label.substring(1).toLowerCase()} ({props.count})
        </label>
      </div>
    );
  }
}
