import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import * as axios from 'axios';
import defaults from 'lodash/defaults';
import TreeView from 'react-treeview';
import cx from 'classnames';

import localization from '../../../lib/localization';
import './publishers-tree.scss';

export class PublishersTree extends React.Component {
  static isItemCollapsed(itemOrgPath, chosenOrgPath) {
    if (chosenOrgPath && chosenOrgPath !== undefined) {
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

  constructor(props) {
    super(props);
    this.state = {
      source: {}
    };
    this.options = defaults({
      headers: {},
      searchUrlPath: '/publisher'
    });
    this.axios = axios.create({
      baseURL: this.host,
      headers: this.options.headers
    });
    this.onChange = this.onChange.bind(this);
    this.loadDatasetFromServer = this.loadDatasetFromServer.bind(this);
  }

  componentDidMount() {
    this.loadDatasetFromServer();
  }

  onChange(value) {
    this.props.onChange(value);
  }

  // @params: the function has no param but the query need dataset id from prop
  // loads all the info for this dataset
  loadDatasetFromServer() {
    const url = `/publisher/hierarchy`;
    axios
      .get(url)
      .then(res => {
        const source = res.data;
        this.setState({
          source
        });
      })
      .catch(error => {
        console.error(error.response);
      });
  }

  render() {
    const { hits } = this.state.source;
    const orgPath = this.props.value && this.props.value.orgPath;

    const subTree = hits =>
      hits.map((node, i) => {
        const chosenClass = cx({
          'tree-item_chosen': node.orgPath === orgPath
        });
        const name = `${node.name.charAt(0)}${node.name
          .substring(1)
          .toLowerCase()}`;
        const label = (
          <span
            className="node"
            onClick={() => {
              this.onChange(node);
            }}
            onKeyPress={() => {
              this.onChange(node);
            }}
            role="button"
            tabIndex="0"
          >
            {name}
          </span>
        );
        const collapsed = PublishersTree.isItemCollapsed(node.orgPath, orgPath);
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
            onClick={() => {
              this.onChange(node);
            }}
            onKeyPress={() => {
              this.onChange(node);
            }}
            role="button"
            tabIndex="0"
          >
            {name}
          </div>
        );
      });

    const mainTree = hits =>
      hits.map((node, i) => {
        const chosenClass = cx('tree-view_main', {
          'tree-item_chosen': node.orgPath === orgPath
        });
        const collapsed = PublishersTree.isItemCollapsed(node.orgPath, orgPath);
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
            onClick={() => {
              this.onChange(node);
            }}
            onKeyPress={() => {
              this.onChange(node);
            }}
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

    if (hits && typeof hits !== 'undefined' && hits.length > 0) {
      return <div key={orgPath}>{mainTree(hits)}</div>;
    }
    return null;
  }
}

PublishersTree.defaultProps = {
  onChange: _.noop,
  value: null
};

PublishersTree.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object
};
