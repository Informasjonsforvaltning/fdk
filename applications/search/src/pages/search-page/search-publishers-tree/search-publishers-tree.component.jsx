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
import { keyPrefixForest } from '../../../lib/key-prefix-forest';

const isItemCollapsed = (itemOrgPath, chosenOrgPath) => {
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
};

const hasSomeChildren = node =>
  node && Array.isArray(node.children) && node.children.length > 0;
const hasSomeSiblingChildren = siblings =>
  Array.isArray(siblings) && siblings.some(hasSomeChildren);

const subTree = ({
  publisherCounts,
  activeFilter,
  publishers,
  onFilterPublisherHierarchy
}) =>
  publisherCounts.map((node, i) => {
    let active = false;
    if (activeFilter === node.key) {
      active = true;
    }

    const name =
      getTranslateText(_get(publishers, [node.key, 'prefLabel'])) ||
      _capitalize(_get(publishers, [node.key, 'name'], node.key));

    const label = (
      <FilterOption
        key={`${node.key}|${i}`}
        itemKey={0.5}
        value={node.key}
        labelRaw={name}
        count={node.count}
        onClick={onFilterPublisherHierarchy}
        active={active}
        displayClass="inline-block"
      />
    );
    const collapsed = isItemCollapsed(node.key, activeFilter);
    if (hasSomeChildren(node)) {
      return (
        <TreeView
          key={`${node.key}|${i}`}
          nodeLabel={label}
          defaultCollapsed={collapsed}
        >
          {subTree({
            publisherCounts: node.children,
            activeFilter,
            publishers,
            onFilterPublisherHierarchy
          })}
        </TreeView>
      );
    }
    return (
      <FilterOption
        key={`${node.key}|${i}`}
        itemKey={0.5}
        value={node.key}
        labelRaw={name}
        count={node.count}
        onClick={onFilterPublisherHierarchy}
        active={active}
        displayClass={hasSomeSiblingChildren(publisherCounts) ? 'indent' : ''}
      />
    );
  });

const mainTree = ({
  publisherCountsForest,
  activeFilter,
  publishers,
  onFilterPublisherHierarchy
}) =>
  Array.isArray(publisherCountsForest) &&
  publisherCountsForest.map((node, i) => {
    let active = false;
    if (activeFilter === node.key) {
      active = true;
    }

    const collapsed = isItemCollapsed(node.key, activeFilter);

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
        count={node.count}
        onClick={onFilterPublisherHierarchy}
        active={active}
        displayClass="inline-block"
      />
    );
    if (node.key !== 'ukjent' && node.key !== 'MISSING') {
      return (
        <div key={`panel${i}`} className="section">
          <TreeView
            key={`${node.key}|${i}`}
            nodeLabel={label}
            defaultCollapsed={collapsed}
            itemClassName="tree-view_main"
          >
            {node.children &&
              node.children.length > 0 &&
              subTree({
                publisherCounts: node.children,
                activeFilter,
                publishers,
                onFilterPublisherHierarchy
              })}
          </TreeView>
        </div>
      );
    }
    name = localization.unknown;
    return (
      <FilterOption
        key={`${node.key}|${i}`}
        itemKey={0.5}
        value={node.key}
        label={name}
        count={node.count}
        onClick={onFilterPublisherHierarchy}
        active={active}
      />
    );
  });

export class SearchPublishersTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: true
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

  render() {
    const { openFilter } = this.state;
    const {
      title,
      publisherCounts,
      onFilterPublisherHierarchy,
      activeFilter,
      publishers
    } = this.props;

    const publisherCountsForest = keyPrefixForest(publisherCounts);

    const collapseIconClass = cx('fa', 'mr-2', {
      'fa-angle-down': !this.state.openFilter,
      'fa-angle-up': this.state.openFilter
    });
    if (Array.isArray(publisherCounts) && publisherCounts.length > 0) {
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
              <div className="fdk-items-list">
                {mainTree({
                  publisherCountsForest,
                  activeFilter,
                  publishers,
                  onFilterPublisherHierarchy
                })}
              </div>
            </div>
          </Collapse>
        </div>
      );
    }
    return null;
  }
}

SearchPublishersTree.defaultProps = {
  title: null,
  publisherCounts: null,
  activeFilter: null,
  publishers: null
};

SearchPublishersTree.propTypes = {
  title: PropTypes.string,
  publisherCounts: PropTypes.array,
  onFilterPublisherHierarchy: PropTypes.func.isRequired,
  activeFilter: PropTypes.string,
  publishers: PropTypes.object
};
