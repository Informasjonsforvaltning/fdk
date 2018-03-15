import React from 'react';
import * as axios from "axios";
import defaults from 'lodash/defaults';
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css';
import cx from 'classnames';

import FilterOption from '../search-results-filterbox-option';
//import './../search-publishers-tree/index.scss';
import './index.scss';

export default class SearchPublishersTree extends React.Component {
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
      multi: false,
      collapsedBookkeeping: _(this.props.filter).filter(f=>!f.hasParent).value() // this.props.filter.map(() => true)
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
    this.handleClick = this.handleClick.bind(this);

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

  handleClick(i) {
    let [...collapsedBookkeeping] = this.state.collapsedBookkeeping;
    collapsedBookkeeping[i] = !collapsedBookkeeping[i];
    this.setState({collapsedBookkeeping: collapsedBookkeeping});
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
      })
      .catch(error => {
        console.error(error.response)
      });
    ;
  }

  _renderTree() {
    const { hits } = this.state.source;
    const { filter, onFilterPublisherHierarchy, activeFilter, publishers } = this.props;

    let filters;
    if (activeFilter) {
      filters = activeFilter.split(',');
    }

    const subTree = hits => hits.map((node, i) => {
      let active = false;
      if (filters && filters.includes(node.key)) {
        active = true;
      }
      const { orgPath } = this.props;
      const chosenClass = cx(
        {
          'tree-item_chosen': node.orgPath === orgPath
        }
      );
      //const name = `${node.name.charAt(0)}${node.name.substring(1).toLowerCase()}`;
      let name = node.key;
      const currentPublisher = publishers[name];
      if (currentPublisher) {
        name = currentPublisher.name.substring(0,25);
      }

      const label = <span className="node" onClick={() => { this.onChange(node)}} role="button" tabIndex="0">{node.key}</span>;
      const label2 = (
        <FilterOption
          key={`${node.key}|${i}`}
          itemKey={0.5}
          value={node.key}
          label={name}
          count={node.doc_count}
          onClick={onFilterPublisherHierarchy}
          active={active}
          displayClass="inline-block"
        />
      )
      const collapsed = SearchPublishersTree.isItemCollapsed(node.key, activeFilter)
      if (node.children && node.children.length > 0) {
        return (
          <TreeView
            key={`${node.key  }|${  i}`}
            nodeLabel={label2}
            defaultCollapsed={collapsed}
            itemClassName={chosenClass}
          >
            {subTree(node.children)}
          </TreeView>
        );
      } return (
        <FilterOption
          key={`${node.key  }|${  i}`}
          itemKey={0.5}
          value={node.key}
          label={name}
          count={node.doc_count}
          onClick={onFilterPublisherHierarchy}
          active={active}
          displayClass=""
        />
      );
    });

    const mainTree = hits => hits.map((node, i) => {
      const { orgPath } = this.props;
      let active = false;
      if (filters && filters.includes(node.key)) {
        active = true;
      }
      const chosenClass = cx(
        'tree-view_main',
        {
          'tree-item_chosen': node.orgPath === orgPath
        }
      );
      const collapsed = SearchPublishersTree.isItemCollapsed(node.key, activeFilter);
      //const name = `${node.name.charAt(0)}${node.name.substring(1).toLowerCase()}`;
      let name = node.key;
      const currentPublisher = publishers[node.key];
      if (currentPublisher) {
        name = currentPublisher.name.substring(0,25);
      }
      // <div className="tester" tabIndex="0" onKeyPress={() => { this.handleClick(i) }} />
      const label = <span className="node" onClick={() => { onClick(node)}} role="button" tabIndex="0"><strong>{node.key}</strong></span>;
      const label2 = (
        <FilterOption
          key={`${node.key}|${  i}`}
          itemKey={0.5}
          value={node.key}
          label={name}
          count={node.doc_count}
          onClick={onFilterPublisherHierarchy}
          active={active}
          displayClass="inline-block"
        />
      )
      return (
        <div key={`panel${i}`} className="section tree-panelXX">
          <TreeView
            key={`${node.key  }|${  i}`}
            nodeLabel={label2}
            defaultCollapsed={collapsed}
            itemClassName={chosenClass}
          >
            {node.children && node.children.length > 0 &&
            subTree(node.children)
            }
          </TreeView>
        </div>
      );
    });

    if (filter && typeof filter !== 'undefined' && filter.length > 0) {
      return (
        <div>
          {mainTree(filter)}
        </div>
      );
    } return null;
  }

  render() {
    const { title } = this.props;
    return (
      <div className="search-filter-publisher pre-scrollableXX">
        <div className="fdk-panel__header">{title}</div>
        <div className="fdk-panel__content">
          <div className="fdk-items-list">
        {this._renderTree()}
          </div>
        </div>
      </div>
    );
  }
}

SearchPublishersTree.defaultProps = {

};

SearchPublishersTree.propTypes = {

};
