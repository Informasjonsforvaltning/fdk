import React from 'react';
import localization from '../../components/localization';

const RefinementOptionOrgPath = (props) => {
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
  const id = encodeURIComponent((itemKey + Math.random()));
  const textLabel = props.label.substr(props.label.lastIndexOf('/')+1);
  const level = (props.label.match(/\//g) || []).length;
  const params = window.location.search
  .substring(1)
  .split("&")
  .map(v => v.split("="))
  .reduce((map, [key, value]) => map.set(key, decodeURIComponent(value)), new Map());
  const orgPathValue = params.get("orgPath[0]") || '';
  const expandedState = props.label.indexOf(orgPathValue) === -1 ? '' : 'expanded';
  return (
    <div className="checkbox">
      {
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      }<label className={'level'+level+ ' ' + expandedState} onKeyPress={onClick} tabIndex="0" htmlFor={id} role="button">
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
export default RefinementOptionOrgPath;
