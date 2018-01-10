import React from 'react';
import localization from '../../components/localization';

const RefinementOptionPublishers = (props) => {
  const {
    bemBlocks, onClick, active, itemKey,
    label
  } = props;
  const toggleId = 'toggle-more-publishers';
  if(label === 'showmorelabel') {
    return (
      <label htmlFor={toggleId} >{localization.facet.showmore}</label>
    )
  } else if(label === 'showfewerlabel') {
    return (
      <label htmlFor={toggleId} >{localization.facet.showfewer}</label>
    )
  } else if(label === 'showmoreinput') {
    return (
      <input type="checkbox" id={toggleId}  />
    )
  }
  const optionLabel = `${props.label.charAt(0)}${props.label.substring(1).toLowerCase()}`;

  const id = encodeURIComponent((itemKey + Math.random()));
  const textLabel = localization.search_hit[optionLabel.toLowerCase()] ? localization.search_hit[optionLabel.toLowerCase()] : optionLabel;
  return (
    <div className="checkbox">
      {
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      }<label onKeyPress={onClick} tabIndex="0" role="button" htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          tabIndex="-1"
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
export default RefinementOptionPublishers;
