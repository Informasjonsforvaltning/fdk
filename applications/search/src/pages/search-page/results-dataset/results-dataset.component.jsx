import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';

import localization from '../../../lib/localization';
import { SearchHitItem } from './search-hit-item/search-hit-item.component';
import { Select } from './select/select.component';
import { FilterBox } from './filter-box/filter-box.component';
import { SearchPublishersTree } from '../search-publishers-tree/search-publishers-tree.component';

export class ResultsDataset extends React.Component {
  _renderFilterModal() {
    const {
      showFilterModal,
      closeFilterModal,
      datasetItems,
      onFilterTheme,
      onFilterAccessRights,
      onFilterPublisherHierarchy,
      onFilterProvenance,
      onFilterSpatial,
      searchQuery,
      themesItems,
      publisherArray,
      publishers
    } = this.props;
    return (
      <Modal show={showFilterModal} onHide={closeFilterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search-filters">
            <FilterBox
              htmlKey={1}
              title={localization.facet.theme}
              filter={datasetItems.aggregations.theme_count}
              onClick={onFilterTheme}
              activeFilter={searchQuery.theme}
              themesItems={themesItems}
            />
            <FilterBox
              htmlKey={2}
              title={localization.facet.accessRight}
              filter={datasetItems.aggregations.accessRightsCount}
              onClick={onFilterAccessRights}
              activeFilter={searchQuery.accessrights}
            />
            <SearchPublishersTree
              title={localization.facet.organisation}
              filter={publisherArray}
              onFilterPublisherHierarchy={onFilterPublisherHierarchy}
              activeFilter={searchQuery.orgPath}
              publishers={publishers}
            />
            <FilterBox
              htmlKey={3}
              title={localization.facet.spatial}
              filter={datasetItems.aggregations.spatial}
              onClick={onFilterSpatial}
              activeFilter={searchQuery.spatial}
            />
            <FilterBox
              htmlKey={4}
              title={localization.facet.provenance}
              filter={datasetItems.aggregations.provenanceCount}
              onClick={onFilterProvenance}
              activeFilter={searchQuery.provenance}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="fdk-button-default fdk-button"
            onClick={closeFilterModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  _renderHits() {
    const { datasetItems, distributionTypeItems } = this.props;
    if (datasetItems && datasetItems.hits && datasetItems.hits.hits) {
      return datasetItems.hits.hits.map(item => (
        <SearchHitItem
          key={item._source.id}
          result={item}
          distributionTypeItems={distributionTypeItems}
        />
      ));
    }
    return null;
  }

  render() {
    const {
      datasetItems,
      onClearSearch,
      onFilterTheme,
      onFilterAccessRights,
      onFilterPublisherHierarchy,
      onFilterProvenance,
      onFilterSpatial,
      onSort,
      onPageChange,
      showClearFilterButton,
      searchQuery,
      themesItems,
      hitsPerPage,
      publisherArray,
      publishers
    } = this.props;
    const page =
      searchQuery && searchQuery.from ? searchQuery.from / hitsPerPage : 0;
    const pageCount = Math.ceil(
      (datasetItems && datasetItems.hits ? datasetItems.hits.total : 1) /
        hitsPerPage
    );

    const clearButtonClass = cx(
      'fdk-button',
      'fdk-button-default-no-hover',
      'fade-in-500',
      {
        hidden: !showClearFilterButton
      }
    );

    return (
      <div id="content" role="main">
        <div id="resultPanel">
          <div className="row mt-1 mb-1-em">
            <div className="col-xs-6 col-md-4">
              <button
                className={clearButtonClass}
                onClick={onClearSearch}
                type="button"
              >
                {localization.query.clear}
              </button>
            </div>
            <div className="col-xs-6 col-md-4 col-md-offset-4">
              <div className="pull-right">
                <Select
                  items={[
                    {
                      label: 'relevance',
                      field: '_score',
                      order: 'asc',
                      defaultOption: true
                    },
                    {
                      label: 'title',
                      field: 'title',
                      order: 'asc'
                    },
                    {
                      label: 'modified',
                      field: 'modified',
                      order: 'desc'
                    },
                    {
                      label: 'publisher',
                      field: 'publisher.name',
                      order: 'asc'
                    }
                  ]}
                  onChange={onSort}
                  activeSort={searchQuery.sortfield}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="search-filters col-md-4 flex-move-first-item-to-bottom visible-sm visible-md visible-lg">
              <span className="uu-invisible" aria-hidden="false">
                Filtrering tilgang
              </span>
              {datasetItems &&
                datasetItems.aggregations && (
                  <div>
                    {this._renderFilterModal()}
                    <FilterBox
                      htmlKey={1}
                      title={localization.facet.theme}
                      filter={datasetItems.aggregations.theme_count}
                      onClick={onFilterTheme}
                      activeFilter={searchQuery.theme}
                      themesItems={themesItems}
                    />
                    <FilterBox
                      htmlKey={2}
                      title={localization.facet.accessRight}
                      filter={datasetItems.aggregations.accessRightsCount}
                      onClick={onFilterAccessRights}
                      activeFilter={searchQuery.accessrights}
                    />
                    <SearchPublishersTree
                      title={localization.facet.organisation}
                      filter={publisherArray}
                      onFilterPublisherHierarchy={onFilterPublisherHierarchy}
                      activeFilter={searchQuery.orgPath}
                      publishers={publishers}
                    />
                    <FilterBox
                      htmlKey={3}
                      title={localization.facet.spatial}
                      filter={datasetItems.aggregations.spatial}
                      onClick={onFilterSpatial}
                      activeFilter={searchQuery.spatial}
                    />
                    <FilterBox
                      htmlKey={4}
                      title={localization.facet.provenance}
                      filter={datasetItems.aggregations.provenanceCount}
                      onClick={onFilterProvenance}
                      activeFilter={searchQuery.provenance}
                    />
                  </div>
                )}
            </div>

            <div id="datasets" className="col-xs-12 col-md-8">
              {this._renderHits()}
            </div>

            <div className="col-xs-12 col-md-8 col-md-offset-4 text-center">
              <span className="uu-invisible" aria-hidden="false">
                Sidepaginering.
              </span>
              <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                previousLabel={localization.page.prev}
                nextLabel={localization.page.next}
                breakLabel={<span>...</span>}
                breakClassName={'break-me'}
                containerClassName={'pagination'}
                onPageChange={onPageChange}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                initialPage={page}
                disableInitialCallback
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ResultsDataset.defaultProps = {
  showFilterModal: false,
  closeFilterModal: null,
  datasetItems: null,
  onFilterTheme: null,
  onFilterAccessRights: null,
  onFilterPublisherHierarchy: null,
  onFilterProvenance: null,
  onFilterSpatial: null,
  searchQuery: {},
  themesItems: null,
  publisherArray: null,
  publishers: null,
  distributionTypeItems: null,
  onClearSearch: null,
  onPageChange: null,
  showClearFilterButton: null,
  hitsPerPage: null
};

ResultsDataset.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,
  datasetItems: PropTypes.object,
  onFilterTheme: PropTypes.func,
  onFilterAccessRights: PropTypes.func,
  onFilterPublisherHierarchy: PropTypes.func,
  onFilterProvenance: PropTypes.func,
  onFilterSpatial: PropTypes.func,
  searchQuery: PropTypes.object,
  themesItems: PropTypes.object,
  publisherArray: PropTypes.array,
  publishers: PropTypes.object,
  distributionTypeItems: PropTypes.array,
  onClearSearch: PropTypes.func,
  onSort: PropTypes.func.isRequired,
  onPageChange: PropTypes.func,
  showClearFilterButton: PropTypes.bool,
  hitsPerPage: PropTypes.number
};
