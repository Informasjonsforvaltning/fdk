import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import TreeView from 'react-treeview';
import cx from 'classnames';
import { resolve } from 'react-resolver';

import localization from '../../../lib/localization';
import './publishers-tree.scss';
import { getPublisherHierarchy } from '../../../api/publishers';

const loadPublisherHierarchy = () =>
  getPublisherHierarchy()
    .then(data => data.hits)
    .catch(console.error);

const memoizedLoadPublisherHierarhy = _.memoize(loadPublisherHierarchy);

function isItemCollapsed(itemOrgPath, chosenOrgPath) {
  if (chosenOrgPath) {
    const parentOrgPath = chosenOrgPath.substr(
      0,
      chosenOrgPath.lastIndexOf('/')
    );
    if (parentOrgPath.indexOf(itemOrgPath) !== -1) {
      return false;
    }
  }
  return true;
}

export const PublishersTreePure = props => {
  const { onChange, value, publishers } = props;
  const { orgPath } = value || {};

  const subTree = publishers =>
    publishers.map((node, i) => {
      const chosenClass = cx({
        'tree-item_chosen': node.orgPath === orgPath
      });
      const name = `${node.name.charAt(0)}${node.name
        .substring(1)
        .toLowerCase()}`;
      const label = (
        <span
          className="node"
          onClick={() => onChange(node)}
          onKeyPress={() => onChange(node)}
          role="button"
          tabIndex="0"
        >
          {name}
        </span>
      );
      const collapsed = isItemCollapsed(node.orgPath, orgPath);
      if (node.children && node.children.length > 0) {
        return (
          <TreeView
            key={`${name}|${i}`}
            nodeLabel={label}
            defaultCollapsed={collapsed}
            itemClassName={chosenClass}
          >
            {subTree(node.children)}
          </TreeView>
        );
      }
      return (
        <div
          key={`${name}|${i}`}
          className={`node tree-view_item ${
            node.orgPath === orgPath ? 'tree-item_chosen' : ''
          }`}
          onClick={() => onChange(node)}
          onKeyPress={() => onChange(node)}
          role="button"
          tabIndex="0"
        >
          {name}
        </div>
      );
    });

  const mainTree = publishers =>
    publishers.map((node, i) => {
      const chosenClass = cx('tree-view_main', {
        'tree-item_chosen': node.orgPath === orgPath
      });
      const collapsed = isItemCollapsed(node.orgPath, orgPath);
      const name =
        node.name === 'STAT' ||
        node.name === 'FYLKE' ||
        node.name === 'KOMMUNE' ||
        node.name === 'PRIVAT' ||
        node.name === 'ANNET'
          ? localization.facet.publishers[node.name]
          : node.name;

      const label = (
        <span
          className="mainTree-btn node"
          onClick={() => onChange(node)}
          onKeyPress={() => onChange(node)}
          role="button"
          tabIndex="0"
        >
          <strong>{name}</strong>
        </span>
      );
      return (
        <div key={`panel${i}`} className="section fdk-report-tree-panel">
          <TreeView
            key={`${name}|${i}`}
            nodeLabel={label}
            defaultCollapsed={collapsed}
            itemClassName={chosenClass}
          >
            {node.children &&
              node.children.length > 0 &&
              subTree(node.children)}
          </TreeView>
        </div>
      );
    });

  if (publishers && publishers.length > 0) {
    return <div key={orgPath}>{mainTree(publishers)}</div>;
  }
  return null;
};

PublishersTreePure.defaultProps = {
  onChange: _.noop,
  value: null,
  publishers: []
};

PublishersTreePure.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object,
  publishers: PropTypes.array
};

const mapProps = {
  publishers: () => memoizedLoadPublisherHierarhy()
};

export const formDistributionApiResolver = resolve(mapProps);

export const PublishersTree = resolve(mapProps)(PublishersTreePure);
