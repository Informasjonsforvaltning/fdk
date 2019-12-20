import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import cx from 'classnames';
import { withRouter } from 'react-router';

import localization from '../../../lib/localization';
import { SearchHitItem } from './search-hit-item/search-hit-item.component';
import { FilterBox } from '../../../components/filter-box/filter-box.component';
import { FilterTree } from '../filter-tree/filter-tree.component';
import { ErrorBoundary } from '../../../components/error-boundary/error-boundary';
import { getSortfield, setPage, setSortfield } from '../search-location-helper';
import { parseSearchParams } from '../../../lib/location-history-helper';
import { FilterPills } from '../filter-pills/filter-pills.component';
import {
  getLosStructure,
  getThemesStructure
} from '../../../redux/modules/referenceData';
import { filterLosThemesFromAggregation } from '../los-aggregations-helper';
import { getConfig } from '../../../config';

function _renderFilterModal({
  showFilterModal,
  closeFilterModal,
  datasetAggregations,
  onFilterTheme,
  onFilterAccessRights,
  onFilterPublisherHierarchy,
  onFilterProvenance,
  onFilterSpatial,
  onFilterLos,
  locationSearch,
  publishers,
  referenceData
}) {
  const losItems = getLosStructure(referenceData);
  const themesItems = getThemesStructure(referenceData);

  return (
    <Modal isOpen={showFilterModal} toggle={closeFilterModal}>
      <ModalHeader toggle={closeFilterModal}>Filter</ModalHeader>
      <ModalBody>
        <div className="search-filters">
          <FilterTree
            title={localization.facet.theme}
            aggregations={filterLosThemesFromAggregation(
              _.get(datasetAggregations, ['los', 'buckets']),
              losItems
            )}
            handleFiltering={onFilterLos}
            activeFilter={locationSearch.losTheme}
            referenceDataItems={losItems}
          />
          {!getConfig().themeNap && (
            <FilterBox
              htmlKey={1}
              title={localization.facet.themeEU}
              filter={datasetAggregations.theme}
              onClick={onFilterTheme}
              activeFilter={locationSearch.theme}
              themesItems={themesItems}
            />
          )}
          {!getConfig().themeNap && (
            <FilterBox
              htmlKey={2}
              title={localization.facet.accessRight}
              filter={datasetAggregations.accessRights}
              onClick={onFilterAccessRights}
              activeFilter={locationSearch.accessrights}
            />
          )}
          <FilterTree
            title={localization.facet.organisation}
            aggregations={datasetAggregations.orgPath.buckets}
            handleFiltering={onFilterPublisherHierarchy}
            activeFilter={locationSearch.orgPath}
            referenceDataItems={publishers}
          />
          <FilterBox
            htmlKey={3}
            title={localization.facet.spatial}
            filter={datasetAggregations.spatial}
            onClick={onFilterSpatial}
            activeFilter={locationSearch.spatial}
          />
          <FilterBox
            htmlKey={4}
            title={localization.facet.provenance}
            filter={datasetAggregations.provenance}
            onClick={onFilterProvenance}
            activeFilter={locationSearch.provenance}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          className="fdk-button"
          onClick={closeFilterModal}
          color="primary"
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function _renderHits({ datasetItems, referenceData }) {
  if (datasetItems && Array.isArray(datasetItems)) {
    return datasetItems.map(dataset => (
      <ErrorBoundary key={dataset.id}>
        <SearchHitItem dataset={dataset} referenceData={referenceData} />
      </ErrorBoundary>
    ));
  }
  return null;
}

export const ResultsDatasetPure = ({
  showFilterModal,
  closeFilterModal,
  datasetItems,
  datasetAggregations,
  datasetTotal,
  onFilterTheme,
  onFilterAccessRights,
  onFilterPublisherHierarchy,
  onFilterProvenance,
  onFilterSpatial,
  onFilterLos,
  hitsPerPage,
  publishers,
  referenceData,
  history,
  location
}) => {
  const locationSearch = parseSearchParams(location);

  const page = parseInt(locationSearch.page || 0, 10);
  const pageCount = Math.ceil((datasetTotal || 1) / hitsPerPage);

  const sortfield = getSortfield(location);
  const sortByScoreClass = cx('fdk-button', 'fdk-button-black-toggle', {
    selected: !sortfield
  });
  const sortByLastModifiedClass = cx('fdk-button', 'fdk-button-black-toggle', {
    selected: sortfield === 'modified'
  });

  const onSortByScoreClick = () => {
    setSortfield(history, location, undefined);
  };
  const onSortByModifiedClick = () => {
    setSortfield(history, location, 'modified');
  };

  const onPageChange = data => {
    setPage(history, location, data.selected);
    window.scrollTo(0, 0);
  };

  const generateSearchParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (getConfig().themeNap) {
      searchParams.append('accessRights', 'PUBLIC');
      searchParams.append('themeprofile', 'transport');
    }
    return searchParams.toString() ? `?${searchParams.toString()}` : '';
  };

  const generateSubscriptionLink = type =>
    type === 'rss' || type === 'atom'
      ? `${
          getConfig().searchHost.host
        }/datasets.${type}${generateSearchParams()}`
      : '#';

  const losItems = getLosStructure(referenceData);
  const themesItems = getThemesStructure(referenceData);

  return (
    <main id="content" data-test-id="datasets">
      <section className="row mb-3">
        <div className="col-6 col-lg-4" />
        <div className="col-6 col-lg-4 offset-lg-4">
          <div className="d-flex justify-content-end">
            <Button
              className={sortByScoreClass}
              onClick={onSortByScoreClick}
              color="primary"
            >
              {localization.sort.relevance}
            </Button>
            <Button
              className={sortByLastModifiedClass}
              onClick={onSortByModifiedClick}
              color="primary"
            >
              {localization.sort.modified}
            </Button>
          </div>
        </div>
      </section>

      <section className="row">
        <aside className="search-filters col-lg-4 d-none d-lg-block">
          <span className="uu-invisible" aria-hidden="false">
            Filtrering tilgang
          </span>

          <FilterPills
            history={history}
            location={location}
            locationSearch={locationSearch}
            themesItems={themesItems}
            publishers={publishers}
            losItems={losItems}
          />

          {datasetItems && datasetAggregations && (
            <div>
              {_renderFilterModal({
                showFilterModal,
                closeFilterModal,
                datasetAggregations,
                onFilterTheme,
                onFilterAccessRights,
                onFilterPublisherHierarchy,
                onFilterProvenance,
                onFilterSpatial,
                onFilterLos,
                locationSearch,
                themesItems,
                publishers,
                referenceData
              })}
              <FilterTree
                title={localization.facet.theme}
                aggregations={filterLosThemesFromAggregation(
                  _.get(datasetAggregations, ['los', 'buckets']),
                  losItems
                )}
                handleFiltering={onFilterLos}
                activeFilter={locationSearch.losTheme}
                referenceDataItems={losItems}
                collapseItems
              />
              {!getConfig().themeNap && (
                <FilterBox
                  htmlKey={1}
                  title={localization.facet.themeEU}
                  filter={datasetAggregations.theme}
                  onClick={onFilterTheme}
                  activeFilter={locationSearch.theme}
                  themesItems={themesItems}
                />
              )}
              {!getConfig().themeNap && (
                <FilterBox
                  htmlKey={2}
                  title={localization.facet.accessRight}
                  filter={datasetAggregations.accessRights}
                  onClick={onFilterAccessRights}
                  activeFilter={locationSearch.accessrights}
                />
              )}
              <FilterTree
                title={localization.facet.organisation}
                aggregations={datasetAggregations.orgPath.buckets}
                handleFiltering={onFilterPublisherHierarchy}
                activeFilter={locationSearch.orgPath}
                referenceDataItems={publishers}
              />
              <FilterBox
                htmlKey={3}
                title={localization.facet.spatial}
                filter={datasetAggregations.spatial}
                onClick={onFilterSpatial}
                activeFilter={locationSearch.spatial}
              />
              <FilterBox
                htmlKey={4}
                title={localization.facet.provenance}
                filter={datasetAggregations.provenance}
                onClick={onFilterProvenance}
                activeFilter={locationSearch.provenance}
              />
            </div>
          )}
        </aside>

        <section className="col-12 col-lg-8">
          {_renderHits({ datasetItems, referenceData })}
        </section>

        <section className="col-12 col-lg-8 offset-lg-4 d-flex justify-content-center position-relative">
          <div className="position-absolute d-flex" style={{ left: 15 }}>
            <a
              href={generateSubscriptionLink('rss')}
              className="d-flex justify-content-center align-items-center"
            >
              <img
                src="/img/icon-feed-sm.svg"
                alt="RSS icon"
                style={{ height: '15px', marginRight: '5px' }}
              />
              RSS
            </a>
            <a
              href={generateSubscriptionLink('atom')}
              className="d-flex justify-content-center align-items-center ml-4"
            >
              <img
                src="/img/icon-feed-sm.svg"
                alt="Atom icon"
                style={{ height: '15px', marginRight: '5px' }}
              />
              Atom
            </a>
          </div>
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
            breakClassName="break-me"
            containerClassName="pagination"
            onPageChange={onPageChange}
            subContainerClassName="pages pagination"
            activeClassName="active"
            forcePage={page}
            disableInitialCallback
          />
        </section>
      </section>
    </main>
  );
};

ResultsDatasetPure.defaultProps = {
  showFilterModal: false,
  closeFilterModal: _.noop,

  datasetItems: null,
  datasetAggregations: null,
  datasetTotal: 1,

  onFilterTheme: _.noop,
  onFilterAccessRights: _.noop,
  onFilterPublisherHierarchy: _.noop,
  onFilterProvenance: _.noop,
  onFilterSpatial: _.noop,
  onFilterLos: _.noop,
  publishers: null,
  referenceData: null,

  hitsPerPage: 10,

  history: { push: _.noop },
  location: { search: '' }
};

ResultsDatasetPure.propTypes = {
  showFilterModal: PropTypes.bool,
  closeFilterModal: PropTypes.func,

  datasetItems: PropTypes.array,
  datasetAggregations: PropTypes.object,
  datasetTotal: PropTypes.number,

  onFilterTheme: PropTypes.func,
  onFilterAccessRights: PropTypes.func,
  onFilterPublisherHierarchy: PropTypes.func,
  onFilterProvenance: PropTypes.func,
  onFilterSpatial: PropTypes.func,
  onFilterLos: PropTypes.func,
  publishers: PropTypes.object,
  referenceData: PropTypes.object,

  hitsPerPage: PropTypes.number,

  history: PropTypes.object,
  location: PropTypes.object
};

export const ResultsDataset = withRouter(ResultsDatasetPure);
