import React from 'react';
import localization from '../../components/localization';
import _find from 'lodash/find';

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
  const id = encodeURIComponent(itemKey);
  let publishers = [];
  if (window.publishers) publishers = window.publishers;

  let orgPathObject = publishers.find(o => o.orgPath === props.label);
  let textLabel = orgPathObject ? orgPathObject.name : '';
  textLabel = (/[a-z]/.test(textLabel) || textLabel.length < 5) ? textLabel : orgPathObject.name.charAt(0).toUpperCase() + orgPathObject.name.substr(1).toLowerCase();
  textLabel = textLabel.replace(' as', ' AS');

  const level = (props.label.match(/\//g) || []).length;
  const params = window.location.search
  .substring(1)
  .split("&")
  .map(v => v.split("="))
  .reduce((map, [key, value]) => map.set(key, decodeURIComponent(value)), new Map());
  const orgPathValue = params.get("orgPath[0]") || '';
  const orgPathSecondValue = params.get("orgPath[1]") || '';

  if(orgPathSecondValue) {
  }
  const hasOrgPathValue = props.label.indexOf(orgPathValue) !== -1;
  let expandedState = hasOrgPathValue ? 'expanded' : '';

  const navigatedToMinistryLevel = (orgPathValue.match(/\//g) || []).length > 1;
  expandedState = (navigatedToMinistryLevel || level < 3) ? 'expanded' : '';
  const onClick2 = () => {
    if(orgPathValue) {
      const orgPathValueCheckbox = window.document.getElementById(encodeURIComponent(orgPathValue));
      if(orgPathValueCheckbox) orgPathValueCheckbox.click();
    }
  }
  return (
    <div className="checkbox">
      {
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      }<label className={'level'+level+ ' ' + expandedState} onKeyPress={onClick} tabIndex="0" htmlFor={id} role="button">
        <input
          type="checkbox"
          id={id}
          tabIndex="-1"
          onClick={onClick2}
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
