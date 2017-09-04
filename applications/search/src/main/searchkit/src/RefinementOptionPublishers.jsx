import * as React from "react";


export class RefinementOptionPublishers extends React.Component {
		render() {
			let props = this.props;
		  const {
		    bemBlocks, onClick, active, disabled, style, itemKey,
		    label, count, showCount, showCheckbox} = props;
			const block = bemBlocks.option;
		  const className = block()
		    .state({ active, disabled })
		    .mix(bemBlocks.container("item"))
			return (
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
			);
		}
}
