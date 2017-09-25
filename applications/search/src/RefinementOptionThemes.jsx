import * as React from "react";

export class RefinementOptionThemes extends React.Component {
		render() {
			let props = this.props;
			let themeLabel = '';
		  const {
		    bemBlocks, onClick, active, disabled, style, itemKey,
		    label, count, showCount, showCheckbox} = props;
			if(window.themes.length > 0) {
				themeLabel =  _.find(window.themes, props.label.substr(-4))[props.label.substr(-4)];
			}
			const block = bemBlocks.option;
		  const className = block()
		    .state({ active, disabled })
		    .mix(bemBlocks.container("item"))
			/*
			 <a onClick={props.onClick} data="ENVI" href="#" className={props.bemBlocks.option().state({active:props.active}) + ' list-group-item fdk-label fdk-label-default'}>
			 {themeLabel}
			 <span className="fdk-badge">(<span className="fdk-count">{props.count}</span>)</span>
			 </a>
			 */
			return (
				<div className="checkbox">
					<label>
						<input
							type="checkbox"
							onClick={props.onClick}
							className={props.bemBlocks.option().state({active:props.active}) + ' list-group-item fdk-label fdk-label-default'}
						/>
            {themeLabel} ({props.count})
					</label>
				</div>
			);
		}
}
