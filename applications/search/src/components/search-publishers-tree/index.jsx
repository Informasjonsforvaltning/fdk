import React from 'react';
import * as axios from "axios";
import defaults from 'lodash/defaults';
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css';
import cx from 'classnames';

import './index.scss';

export default class SearchPublishersTree extends React.Component {
  static getPublishers (input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return axios.get(`/publisher?q=${input}`)
      .then((response) => {
        const hits = response.data.hits.hits;
        const nodes = hits.map(item => item._source);
        return { options: nodes }
      });
  }

  static isItemCollapsed(itemOrgPath, chosenOrgPath) {
    if (chosenOrgPath && chosenOrgPath !== undefined) {
      const parentOrgPath = chosenOrgPath.substr(0, chosenOrgPath.lastIndexOf('/'))
      if (parentOrgPath.indexOf(itemOrgPath) !== -1) {
        return false;
      }
    }
    return true;
  }

  constructor(props) {
    super(props);
    this.state = {
      source: {},
      backspaceRemoves: true,
      multi: false
    };
    this.options = defaults({
      headers:{},
      searchUrlPath: "/publisher"
    });
    this.axios = axios.create({
      baseURL:this.host,
      headers:this.options.headers
    });
    this.onChange = this.onChange.bind(this);
    this.loadDatasetFromServer = this.loadDatasetFromServer.bind(this);
  }

  componentDidMount() {
    this.loadDatasetFromServer();
  }

  onChange (value) {
    this.setState({
      value,
    });
    if (!value) {
      this.props.onSearch(null, '');
    } else {
      this.props.onSearch(value.name, value.orgPath);
    }
  }

  // @params: the function has no param but the query need dataset id from prop
  // loads all the info for this dataset
  loadDatasetFromServer() {
    const url = `/publisher/hierarchy`;
    axios.get(url)
      .then((res) => {
        const data = res.data;
        const source = data;
        this.setState({
          source
        });
      });
  }

  _renderTree() {
    const { hits } = this.state.source;

    const subTree = hits => hits.map((node, i) => {
      const { orgPath } = this.props;
      const chosenClass = cx(
        {
          'tree-item_chosen': node.orgPath === orgPath
        }
      );
      const name = node.name;
      const label = <span className="node" onClick={() => { this.onChange(node)}} role="button" tabIndex="0">{name}</span>;
      if (node.children && node.children.length > 0) {
        return (
          <TreeView key={`${name  }|${  i}`} nodeLabel={label} defaultCollapsed={SearchPublishersTree.isItemCollapsed(node.orgPath, orgPath)} itemClassName={chosenClass}>
            {subTree(node.children)}
          </TreeView>
        );
      } return (
        <div key={`${name  }|${  i}`} className={`node tree-view_item ${node.orgPath === orgPath ? 'tree-item_chosen' : ''}`} onClick={() => { this.onChange(node)}} role="button" tabIndex="0">{name}</div>
      );
    });

    const mainTree = hits => hits.map((node, i) => {
      const { orgPath } = this.props;
      const chosenClass = cx(
        'tree-view_main',
        {
          'tree-item_chosen': node.orgPath === orgPath
        }
      );
      const collapsed = SearchPublishersTree.isItemCollapsed(node.orgPath, orgPath);
      const name = node.name;
      const label = <span className="node" onClick={() => { this.onChange(node)}} role="button" tabIndex="0"><strong>{name}</strong></span>;
      return (
        <div key={`panel${i}`} className="section sk-panel">
          <TreeView key={`${name  }|${  i}`} nodeLabel={label} defaultCollapsed={collapsed} itemClassName={chosenClass}>
            {node.children && node.children.length > 0 &&
            subTree(node.children)
            }
          </TreeView>
        </div>
      );
    });

    if (hits && typeof hits !== 'undefined' && hits.length > 0) {
      return (
        <div>
          {mainTree(hits)}
        </div>
      );
    } return null;
  }

  render() {
    return (
      <div>
        {this._renderTree()}
      </div>
    );
  }
}

SearchPublishersTree.defaultProps = {

};

SearchPublishersTree.propTypes = {

};
