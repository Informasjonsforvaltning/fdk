import React from 'react';
import PropTypes from 'prop-types';
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css';
import cx from 'classnames';
import { Collapse } from 'reactstrap';
import _get from 'lodash/get';
import _capitalize from 'lodash/capitalize';

import { FilterOption } from '../../../components/filter-option/filter-option.component';
import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';
import './search-publishers-tree.scss';

export class SearchPublishersTree extends React.Component {
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
      openFilter: true // (props.activeFilter && props.activeFilter !== '') ? true : false,
    };
    this.toggleFilter = this.toggleFilter.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    if (!value) {
      this.props.onSearch(null, '');
    } else {
      this.props.onSearch(value.name, value.orgPath);
    }
  }

  toggleFilter() {
    this.setState({ openFilter: !this.state.openFilter });
  }

  _renderTree() {
    const {
      filter,
      onFilterPublisherHierarchy,
      activeFilter,
      publishers
    } = this.props;
    const filters = activeFilter;

    const subTree = (hits, activeFilter) => {
      let nodeOnSameLevelHasChildren = false;
      return hits.map((node, i) => {
        let active = false;
        if (filters && filters === node.key) {
          active = true;
        }
        const { orgPath } = this.props;
        const chosenClass = cx({
          'tree-item_chosen': node.key === orgPath
        });

        const name =
          getTranslateText(_get(publishers, [node.key, 'prefLabel'])) ||
          _capitalize(_get(publishers, [node.key, 'name'], node.key));

        const label = (
          <FilterOption
            key={`${node.key}|${i}`}
            itemKey={0.5}
            value={node.key}
            labelRaw={name}
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
          nodeOnSameLevelHasChildren = true;
          return (
            <TreeView
              key={`${node.key}|${i}`}
              nodeLabel={label}
              defaultCollapsed={collapsed}
              itemClassName={chosenClass}
            >
              {subTree(node.children, activeFilter)}
            </TreeView>
          );
        }
        return (
          <FilterOption
            key={`${node.key}|${i}`}
            itemKey={0.5}
            value={node.key}
            labelRaw={name}
            count={node.doc_count}
            onClick={onFilterPublisherHierarchy}
            active={active}
            displayClass={nodeOnSameLevelHasChildren ? 'indent' : ''}
          />
        );
      });
    };

    const mainTree = (hits, activeFilter) =>
      hits.map((node, i) => {
        const { orgPath } = this.props;
        let active = false;
        if (filters && filters === node.key) {
          active = true;
        }
        const chosenClass = cx('tree-view_main', {
          'tree-item_chosen': node.key === orgPath
        });
        const collapsed = SearchPublishersTree.isItemCollapsed(
          node.key,
          activeFilter
        );

        let name = node.key;
        if (publishers) {
          const currentPublisher = publishers[node.key];
          if (currentPublisher) {
            name =
              currentPublisher.id === 'STAT' ||
              currentPublisher.id === 'FYLKE' ||
              currentPublisher.id === 'KOMMUNE' ||
              currentPublisher.id === 'PRIVAT' ||
              currentPublisher.id === 'ANNET'
                ? localization.facet.publishers[currentPublisher.name]
                : currentPublisher.name;
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
        if (node.key !== 'ukjent') {
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
                  subTree(node.children, activeFilter)}
              </TreeView>
            </div>
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
            displayClass="indent"
          />
        );
      });

    if (filter && typeof filter !== 'undefined' && filter.length > 0) {
      return <div>{mainTree(filter, activeFilter)}</div>;
    }
    return null;
  }

  render() {
    const { openFilter } = this.state;
    const { title } = this.props;
    const collapseIconClass = cx('fa', 'mr-2', {
      'fa-angle-down': !this.state.openFilter,
      'fa-angle-up': this.state.openFilter
    });
    return (
      <div className="search-filter-publisher">
        <div className="fdk-panel__header">
          <button
            className="fdk-publisher-toggle p-0"
            onClick={this.toggleFilter}
          >
            <i className={collapseIconClass} />
            <span>{title}</span>
          </button>
        </div>
        <Collapse isOpen={openFilter}>
          <div className="fdk-panel__content">
            <div className="fdk-items-list">{this._renderTree()}</div>
          </div>
        </Collapse>
      </div>
    );
  }
}

SearchPublishersTree.defaultProps = {
  title: null,
  filter: null,
  activeFilter: null,
  publishers: null,
  onSearch: null,
  orgPath: null
};

SearchPublishersTree.propTypes = {
  title: PropTypes.string,
  filter: PropTypes.array,
  onFilterPublisherHierarchy: PropTypes.func.isRequired,
  activeFilter: PropTypes.string,
  publishers: PropTypes.object,
  onSearch: PropTypes.func,
  orgPath: PropTypes.string
};
