import React from 'react';
import PropTypes from 'prop-types';
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css';
import _ from 'lodash';

import localization from '../../../../lib/localization';
import { getTranslateText } from '../../../../lib/translateText';
import {
  getAllLosParentNodes,
  getAllLosChildrenNodes
} from '../../../../redux/modules/referenceData';
import { TreeLosOption } from '../field-tree-los/field-tree-los-option.component';
import {
  isNodeActive,
  getTopicsToDisplay,
  hasActiveChildren
} from './field-tree-los-helper';
import { handleUpdateField } from '../form-helper';
import './field-tree-los.scss';

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
            handleUpdateField(input, event);
          }}
          activeNode={isNodeActive(input, node)}
          displayClass="inline-block"
        />
      </div>
    ))
  );
};

const renderNodes = ({ nodes, losItems, input, defaultOpenTree }) => {
  if (!nodes) {
    return null;
  }
  return (
    nodes &&
    nodes.map(node => {
      const children = _.get(node, 'children', []);
      const nodeIsOpen = defaultOpenTree || hasActiveChildren(input, children);
      return (
        <div key={`${node.uri}-${defaultOpenTree}`}>
          <TreeView
            nodeLabel={
              <TreeLosOption
                itemKey={0.5}
                value={node.uri}
                label={getTranslateText(node.name)}
                onClick={event => {
                  handleUpdateField(input, event);
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
          handleUpdateField(input, e);
        }}
        activeNode={isNodeActive(input, topic)}
        displayClass="inline-block"
      />
    </div>
  ));

export const FieldTreeLos = props => {
  const { losItems, input, defaultOpenTree, defaultShowTopic } = props;
  return (
    <div className="d-flex">
      <div className="w-50">
        <strong>{localization.schema.los.themeLabel}</strong>
        {renderNodes({
          nodes: getAllLosParentNodes(losItems),
          losItems,
          input,
          defaultOpenTree
        })}
      </div>
      <div className="pl-5 border-left">
        <strong>{localization.schema.los.topicsLabel}</strong>
        {renderTopics(
          getTopicsToDisplay(input, losItems, defaultShowTopic),
          input
        )}
      </div>
    </div>
  );
};

FieldTreeLos.defaultProps = {
  losItems: null,
  defaultOpenTree: false,
  defaultShowTopic: null
};

FieldTreeLos.propTypes = {
  losItems: PropTypes.array,
  input: PropTypes.object.isRequired,
  defaultOpenTree: PropTypes.bool,
  defaultShowTopic: PropTypes.object
};
