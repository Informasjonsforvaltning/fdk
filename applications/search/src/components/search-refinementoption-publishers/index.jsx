import * as React from 'react';


export default class RefinementOptionPublishers extends React.Component {
  render() {
    const props = this.props;
    console.log('publ: ' + JSON.stringify(props));
		  const {
		    bemBlocks, onClick, active, disabled, style, itemKey,
		    label, count, showCount, showCheckbox } = props;
    const block = bemBlocks.option;
		  const className = block()
		    .state({ active, disabled })
		    .mix(bemBlocks.container('item'));
    /*
			 <a
			 data="ENVI"
			 href="#"
			 onClick={props.onClick}
			 className=
			 {props.bemBlocks.option().state({active:props.active}).mix(props.bemBlocks.container("item")) +
			 ' list-group-item fdk-label fdk-label-default'}
			 >{props.label}
			 <span className="fdk-badge">(<span className="fdk-count">{props.count}</span>)</span>
			 </a>
			 */
    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            onClick={props.onClick}
            className={`${props.bemBlocks.option().state({ active: props.active }).mix(props.bemBlocks.container('item'))
            } list-group-item fdk-label fdk-label-default`}
          />
          {props.label.charAt(0)}{props.label.substring(1).toLowerCase()} ({props.count})
        </label>
      </div>
    );
  }
}
