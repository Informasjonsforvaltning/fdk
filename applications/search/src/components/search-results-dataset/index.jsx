import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Modal, Button } from 'react-bootstrap';

import localization from '../localization';
import SearchHitItem from '../search-results-hit-item';
import SelectDropdown from '../search-results-selector-dropdown';
import FilterBox from '../search-results-filterbox';

export default class ResultsDataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  _renderPublisherRefinementListFilter() {
    this.publisherFilter =
      (<RefinementListFilter
        id="publisher"
        title={localization.facet.organisation}
        field="publisher.name.raw"
        operator="AND"
        size={5/* NOT IN USE!!! see QueryTransport.jsx */}
        itemComponent={RefinementOptionPublishers}
      />);
    return this.publisherFilter;
  }

  _renderPublisherRefinementListFilterMobile() {
    this.publisherFilter =
      (<RefinementListFilter
        id="publisher"
        title={localization.facet.organisation}
        field="publisher.name.raw"
        operator="AND"
        size={5/* NOT IN USE!!! see QueryTransport.jsx */}
        itemComponent={RefinementOptionPublishersMobile}
      />);
    return this.publisherFilter;
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  _renderFilterModal() {
    const { showFilterModal, closeFilterModal, datasetItems, onFilterTheme, onFilterAccessRights, onFilterPublisher, searchQuery, themesItems } = this.props;
    return (
      <Modal show={showFilterModal} onHide={closeFilterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search-filters">
            <FilterBox
              title={localization.facet.theme}
              filter={datasetItems.aggregations.theme_count}
              onClick={onFilterTheme}
              activeFilter={searchQuery.theme}
              themesItems={themesItems}
            />
            <FilterBox
              title={localization.facet.accessRight}
              filter={datasetItems.aggregations.accessRightsCount}
              onClick={onFilterAccessRights}
              activeFilter={searchQuery.accessrights}
            />
            <FilterBox
              title={localization.facet.organisation}
              filter={datasetItems.aggregations.publisherCount}
              onClick={onFilterPublisher}
              activeFilter={searchQuery.publisher}
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
    const { datasetItems } = this.props;
    if (datasetItems && datasetItems.hits && datasetItems.hits.hits) {
      return datasetItems.hits.hits.map(item => (
        <SearchHitItem
          key={item._source.id}
          result={item}
        />
      ));
    }
    return null;
  }

  render() {
    const { datasetItems, onFilterTheme, onFilterAccessRights, onFilterPublisher, onSort, onPageChange, searchQuery, themesItems, hitsPerPage } = this.props;
    const page = (searchQuery && searchQuery.from) ? (searchQuery.from / hitsPerPage) : 0;
    const pageCount = Math.ceil( ((datasetItems && datasetItems.hits) ? datasetItems.hits.total : 1) / hitsPerPage);

    return (
      <div>
        <div id="content" role="main">
          <div className="container">
            <div id="resultPanel">
              <div className="row mt-1 mb-1">
                <div className="col-md-4 col-md-offset-8">
                  <div className="pull-right">
                    <SelectDropdown
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
                      selectedLanguageCode={this.props.selectedLanguageCode}
                      onChange={onSort}
                      activeSort={searchQuery.sortfield}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="search-filters col-md-4 flex-move-first-item-to-bottom visible-md visible-lg">
                  <span className="uu-invisible" aria-hidden="false">Filtrering tilgang</span>
                  {datasetItems && datasetItems.aggregations &&
                    <div>
                      {this._renderFilterModal()}
                      <FilterBox
                        title={localization.facet.theme}
                        filter={datasetItems.aggregations.theme_count}
                        onClick={onFilterTheme}
                        activeFilter={searchQuery.theme}
                        themesItems={themesItems}
                      />
                      <FilterBox
                        title={localization.facet.accessRight}
                        filter={datasetItems.aggregations.accessRightsCount}
                        onClick={onFilterAccessRights}
                        activeFilter={searchQuery.accessrights}
                      />
                      <FilterBox
                        title={localization.facet.organisation}
                        filter={datasetItems.aggregations.publisherCount}
                        onClick={onFilterPublisher}
                        activeFilter={searchQuery.publisher}
                      />
                    </div>
                  }
                </div>

                <div id="datasets" className="col-xs-12 col-md-8">
                  {this._renderHits()}
                </div>

                <div className="col-xs-12 col-md-8 col-md-offset-4 text-center">
                  <span className="uu-invisible" aria-hidden="false">Sidepaginering.</span>
                  <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={1}
                    previousLabel={localization.page.prev}
                    nextLabel={localization.page.next}
                    breakLabel={<span>...</span>}
                    breakClassName={"break-me"}
                    containerClassName={"pagination"}
                    onPageChange={onPageChange}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                    initialPage={page}
                    disableInitialCallback={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ResultsDataset.defaultProps = {
  selectedLanguageCode: null
};

ResultsDataset.propTypes = {
  selectedLanguageCode: PropTypes.string
};
