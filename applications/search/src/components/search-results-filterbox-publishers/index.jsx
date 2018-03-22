import React from "react";
import PropTypes from "prop-types";
import TreeView from "react-treeview";
import "react-treeview/react-treeview.css";
import cx from "classnames";

import FilterOption from "../search-results-filterbox-option";
import "./index.scss";

export default class SearchPublishersTree extends React.Component {
  static isItemCollapsed(itemOrgPath, chosenOrgPath) {
    if (chosenOrgPath && chosenOrgPath !== undefined) {
      const parentOrgPath = chosenOrgPath.substr(
        0,
        chosenOrgPath.lastIndexOf("/")
      );
      if (parentOrgPath.indexOf(itemOrgPath) !== -1) {
        return false;
      }
    }
    return true;
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({
      value
    });
    if (!value) {
      this.props.onSearch(null, "");
    } else {
      this.props.onSearch(value.name, value.orgPath);
    }
  }

  _renderTree() {
    const {
      filter,
      onFilterPublisherHierarchy,
      activeFilter,
      publishers
    } = this.props;
    const filters = activeFilter;

    const subTree = hits =>
      hits.map((node, i) => {
        let active = false;
        if (filters && filters.includes(node.key)) {
          active = true;
        }
        const { orgPath } = this.props;
        const chosenClass = cx({
          "tree-item_chosen": node.orgPath === orgPath
        });

        let name = node.key;
        if (publishers) {
          const currentPublisher = publishers[name];
          if (currentPublisher) {
            name = currentPublisher.name; // .substring(0, 25);
          }
        }
        const label = (
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
        );
        const collapsed = SearchPublishersTree.isItemCollapsed(
          node.key,
          activeFilter
        );
        if (node.children && node.children.length > 0) {
          return (
            <TreeView
              key={`${node.key}|${i}`}
              nodeLabel={label}
              defaultCollapsed={collapsed}
              itemClassName={chosenClass}
            >
              {subTree(node.children)}
            </TreeView>
          );
        }
        return (
          <FilterOption
            key={`${node.key}|${i}`}
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

    const mainTree = (hits, activeFilter) =>
      hits.map((node, i) => {
        const { orgPath } = this.props;
        let active = false;
        if (filters && filters.includes(node.key)) {
          active = true;
        }
        const chosenClass = cx("tree-view_main", {
          "tree-item_chosen": node.orgPath === orgPath
        });
        const collapsed = SearchPublishersTree.isItemCollapsed(
          node.key,
          activeFilter
        );

        let name = node.key;
        if (publishers) {
          const currentPublisher = publishers[node.key];
          if (currentPublisher) {
            name = currentPublisher.name; // .substring(0, 25);
          }
        }

        const label = (
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
        );
        return (
          <div key={`panel${i}`} className="section">
            <TreeView
              key={`${node.key}|${i}`}
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

    if (filter && typeof filter !== "undefined" && filter.length > 0) {
      return <div>{mainTree(filter)}</div>;
    }
    return null;
  }

  render() {
    const { title } = this.props;
    return (
      <div className="search-filter-publisher pre-scrollableXX">
        <div className="fdk-panel__header">{title}</div>
        <div className="fdk-panel__content">
          <div className="fdk-items-list">{this._renderTree()}</div>
        </div>
      </div>
    );
  }
}

SearchPublishersTree.defaultProps = {
  title: null,
  activeFilter: null,
  publishers: null
};

SearchPublishersTree.propTypes = {
  title: PropTypes.string,
  filter: PropTypes.array.isRequired,
  onFilterPublisherHierarchy: PropTypes.func.isRequired,
  activeFilter: PropTypes.string,
  publishers: PropTypes.object
};
