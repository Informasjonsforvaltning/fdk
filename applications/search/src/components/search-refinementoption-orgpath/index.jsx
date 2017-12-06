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
  const id = encodeURIComponent(itemKey);
  let publishers = [];
  if (window.publishers) publishers = window.publishers;

  let orgPath = publishers.find(o => o.orgPath === props.label) || {orgPath: '', name: ''};
  let textLabel = orgPath ? orgPath.name : '';
  textLabel = (/[a-z]/.test(textLabel) || textLabel.length < 5) ? textLabel : orgPath.name.charAt(0).toUpperCase() + orgPath.name.substr(1).toLowerCase();
  textLabel = textLabel.replace(' as', ' AS');
  textLabel = textLabel.replace(' ASa', ' ASA');

  const level = (props.label.match(/\//g) || []).length;
  const params = window.location.search
    .substring(1)
    .split("&")
    .map(v => v.split("="))
    .reduce((map, [key, value]) => 
      map.set(key, decodeURIComponent(value)), new Map());
  const paramOrgPath = params.get("orgPath[0]") || '';
  const paramOrgPathSecondValue = params.get("orgPath[1]") || '';
  const hasOrgPathInParams = orgPath.orgPath.indexOf(paramOrgPath) !== -1;

  let navigatedOrLevel = (paramOrgPath.match(/\//g) || []).length > 1 || level < 3;  
  let parentOrgPath = orgPath.orgPath.substr(0, orgPath.orgPath.lastIndexOf('/'));
  let parentInOrgPath = paramOrgPath && paramOrgPath === parentOrgPath;
  let isSibling = publishers
    .filter(publisher => parentOrgPath === publisher.orgPath.substr(0, publisher.orgPath.lastIndexOf('/')))
    .filter(publisher => publisher.orgPath === orgPath.orgPath).map(p => true);
  let expandedState = ((hasOrgPathInParams && navigatedOrLevel) || parentInOrgPath) ? 'expanded' : '';

  //let siblings = publishers.filter(publisher => parentOrgPath === publisher.orgPath.substr(0, publisher.orgPath.lastIndexOf('/')));
  let myIndex = publishers.indexOf(orgPath) || 0;
  let hideNext = '';
  let showDown = '';
  let last = myIndex + 1 === publishers.length;
  if (last) {
    hideNext = 'show-empty';
  } else {
    let next = publishers[myIndex + 1].orgPath;
    let nextInListIsSibling = (next.match(/\//g) || []).length === level;
    let nextIsUncle = (next.match(/\//g) || []).length < level;    
    hideNext = (nextInListIsSibling || nextIsUncle) ? 'show-empty' : '';
    let nextIsChild = !(nextInListIsSibling || nextIsUncle);
    if (nextIsChild) {
      showDown = 
        ((next.indexOf(paramOrgPath) !== -1 
            && ((paramOrgPath.match(/\//g) || []).length > 1
              || (next.match(/\//g) || []).length < 3))
        //  || publishers
        //      .filter(publisher => orgPath.orgPath === publisher.orgPath.substr(0, publisher.orgPath.lastIndexOf('/')))
        //      .filter(publisher => next === orgPath.orgPath).map(p => true)
        ) ? '' : ' showDown';
    }
  } 

  const onClick2 = () => {
    if(paramOrgPath) {
      const orgPathValueCheckbox = window.document.getElementById(encodeURIComponent(paramOrgPath));
      if(orgPathValueCheckbox) orgPathValueCheckbox.click();
    }
  }
  const checkboxActive = (orgPath && (paramOrgPath === orgPath.orgPath ))? 'checkboxActive' : '';
  return (
    <div className={'checkbox ' + checkboxActive}>
      {
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      }<label className={'level' + level + ' ' + expandedState} onKeyPress={onClick} tabIndex="0" htmlFor={id} role="button">
        <input
          type="checkbox"
          id={id}
          tabIndex="-1"
          onClick={onClick2}
          checked={active}
          onChange={onClick}
          className={
            `${bemBlocks.option().state({ active }).mix(bemBlocks.container('item'))} 
            list-group-item fdk-label fdk-label-default`
          }
        />
        <label className={'chevron-checkbox-replacement ' + hideNext + showDown} htmlFor={id}>
          <i className="fa fa-chevron-up"/>
          <i className="fa fa-chevron-down"/>
          <i className="empty-icon"/>
        </label>
        {textLabel} ({props.count})
      </label>      
      <hr/>
    </div>
  );
}
export default RefinementOptionOrgPath;
