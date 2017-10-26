import * as React from 'react';
import localization from '../../components/localization';

export class RefinementOptionPublishers extends React.Component {
  render() {
    const props = this.props;
    const {
      bemBlocks, onClick, active, itemKey,
      label
    } = props;
    let optionLabel;
    if (props.label === 'Ukjent') {
      optionLabel = props.label;
    } else {
      optionLabel = `${props.label.charAt(0)}${props.label.substring(1).toLowerCase()}`;
    }
    const id = encodeURIComponent((itemKey + Math.random()));
    const textLabel = localization.search_hit[optionLabel] ? localization.search_hit[optionLabel] : optionLabel;
    return (
      <div className="checkbox">
        <label htmlFor={id}>
          <input
            type="checkbox"
            id={id}
            checked={active}
            onChange={onClick}
            className={`${bemBlocks.option().state({ active }).mix(bemBlocks.container('item'))
            } list-group-item fdk-label fdk-label-default`}
          />
          <label className="checkbox-replacement" htmlFor={id} />
          {textLabel} ({props.count})
        </label>
      </div>
    );
  }
}
