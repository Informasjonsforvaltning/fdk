import React from 'react';
import PropTypes from 'prop-types';
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css';
import _ from 'lodash';

import localization from '../../../lib/localization';
import getTranslateText from '../../../lib/translateText';
import {
  getAllLosParentNodes,
  getAllLosChildrenNodes
} from './../../../redux/modules/referenceData';
import { TreeLosOption } from '../field-tree-los/field-tree-los-option.component';
import {
  isNodeActive,
  getTopicsToDisplay,
  hasActiveChildren,
  getLosItemsFromInput
} from './field-tree-los-helper';
import './field-tree-los.scss';

const handleChange = (input, event) => {
  const selectedItemURI = event.target.value;
  // Skal fjerne fra array
  if (!event.target.checked) {
    const newInput = input.value.filter(
      returnableObjects => returnableObjects.uri !== selectedItemURI
    );
    input.onChange(newInput);
  } else {
    // add object
    let updates = [];
    updates = input.value.map(item => item);
    const addItem = {
      uri: selectedItemURI
    };

    updates.push(addItem);
    input.onChange(updates);
  }
};

const renderChildrenNodes = ({ childrenNodes, input }) => {
  if (!childrenNodes) {
    return null;
  }
  return (
    childrenNodes &&
    childrenNodes.map(node => (
      <div key={node.uri}>
        <TreeLosOption
          key={node.uri}
          itemKey={0.5}
          value={node.uri}
          label={getTranslateText(node.name)}
          onClick={event => {
            handleChange(input, event);
          }}
          activeNode={isNodeActive(input, node)}
          displayClass="inline-block"
        />
      </div>
    ))
  );
};

const renderNodes = ({ nodes, losItems, input }) => {
  if (!nodes) {
    return null;
  }
  return (
    nodes &&
    nodes.map(node => {
      const children = _.get(node, 'children', []);
      const nodeIsOpen = hasActiveChildren(input, children);
      return (
        <div key={node.uri}>
          <TreeView
            nodeLabel={
              <TreeLosOption
                itemKey={0.5}
                value={node.uri}
                label={getTranslateText(node.name)}
                onClick={event => {
                  handleChange(input, event);
                }}
                activeNode={isNodeActive(input, node)}
                displayClass="inline-block"
              />
            }
            defaultCollapsed={!nodeIsOpen}
            itemClassName="tree-view_main d-flex flex-row-reverse justify-content-end ml-2 py-2"
          >
            {renderChildrenNodes({
              childrenNodes: getAllLosChildrenNodes(losItems, children),
              input
            })}
          </TreeView>
        </div>
      );
    })
  );
};

const renderTopics = (topicsToShow, input) =>
  topicsToShow &&
  topicsToShow.map((topic, index) => (
    <div key={`topic-${topic.uri}-${index}`}>
      <TreeLosOption
        itemKey={0.5}
        value={topic.uri}
        label={getTranslateText(topic.name)}
        onClick={e => {
          handleChange(input, e);
        }}
        activeNode={isNodeActive(input, topic)}
        displayClass="inline-block"
      />
    </div>
  ));

const renderFilterPills = (input, losItems) => {
  const chosenLosItems = getLosItemsFromInput(input, losItems);
  return (
    chosenLosItems &&
    chosenLosItems.map((item, index) => {
      if (item !== undefined) {
        let inputRef;
        return (
          <div key={`filter-${index}-${_.get(item, 'uri')}`}>
            {/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */}
            <label
              className="mr-2 mb-1 fdk-badge badge badge-secondary fdk-text-size-15"
              onKeyPress={() => {
                inputRef.click();
              }}
              tabIndex="0"
              role="button"
              htmlFor={_.get(item, 'uri')}
            >
              <input
                className="badge"
                ref={input => {
                  inputRef = input;
                }}
                type="text"
                defaultValue={_.get(item, 'uri')}
                checked={false}
                onClick={e => {
                  handleChange(input, e);
                }}
                label={getTranslateText(_.get(item, 'name'))}
                id={_.get(item, 'uri')}
              />
              <span className="fdk-filter-pill">
                {getTranslateText(_.get(item, 'name'))}
              </span>
            </label>
            {/* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */}
          </div>
        );
      }
      return null;
    })
  );
};

export const FieldTreeLos = props => {
  const { losItems, input } = props;
  return (
    <React.Fragment>
      <div className="d-flex flex-wrap my-2">
        {renderFilterPills(input, losItems)}
      </div>
      <div className="d-flex">
        <div className="w-50">
          <strong>{localization.schema.los.themeLabel}</strong>
          {renderNodes({
            nodes: getAllLosParentNodes(losItems),
            losItems,
            input
          })}
        </div>
        <div className="pl-5 border-left">
          <strong>{localization.schema.los.topicsLabel}</strong>
          {renderTopics(getTopicsToDisplay(input, losItems), input)}
        </div>
      </div>
    </React.Fragment>
  );
};

FieldTreeLos.defaultProps = {
  losItems: null
};

FieldTreeLos.propTypes = {
  losItems: PropTypes.array,
  input: PropTypes.object.isRequired
};
