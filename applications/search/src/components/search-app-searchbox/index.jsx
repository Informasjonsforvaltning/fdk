import React from 'react';
import PropTypes from 'prop-types';

import localization from '../localization';
import CustomHitsStats from '../search-result-custom-hitstats';
import './index.scss';

const SearchBox = props => {
  const {
    onSearchSubmit,
    onSearchChange,
    searchQuery,
    countDatasets,
    isFetchingDatasets,
    countTerms,
    isFetchingTerms,
    open
  } = props;
  let refSearchBox; // eslint-disable-line no-unused-vars
  return (
    <div className="row mb-60">
      <div className="col-12 col-md-8 col-md-offset-2 fdk-search-flex">
        <div className="visible-xs">
          <button
            type="button"
            className="fdk-button fdk-button-filter"
            onClick={open}
          >
            Filter
          </button>
        </div>
        <div className="fdk-search-box">
          <form
            onSubmit={e => {
              e.preventDefault();
              onSearchSubmit(e.target.value);
            }}
          >
            <label htmlFor="searchBox">
              <input
                name="searchBox"
                ref={input => {
                  refSearchBox = input;
                }}
                type="search"
                placeholder={localization.query.intro}
                aria-label={localization.query.intro}
                className="fdk-search"
                value={searchQuery || ''}
                onChange={e => {
                  e.preventDefault();
                  onSearchChange(e);
                }}
              />
            </label>
          </form>
        </div>
        <button
          type="button"
          onClick={refSearchBox => {
            onSearchSubmit(refSearchBox.target.value);
          }}
          className="fdk-button-search btn btn-lg"
        >
          <i className="fa fa-search mr-2" />
          Søk
        </button>
      </div>
      <div className="col-md-12 text-center">
        <CustomHitsStats
          countDatasets={countDatasets}
          isFetchingDatasets={isFetchingDatasets}
          countTerms={countTerms}
          isFetchingTerms={isFetchingTerms}
        />
      </div>
    </div>
  );
};

SearchBox.defaultProps = {
  searchQuery: null,
  countDatasets: null,
  isFetchingDatasets: false,
  countTerms: null,
  isFetchingTerms: false
};

SearchBox.propTypes = {
  onSearchSubmit: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  countDatasets: PropTypes.number,
  isFetchingDatasets: PropTypes.bool,
  countTerms: PropTypes.number,
  isFetchingTerms: PropTypes.bool,
  open: PropTypes.func.isRequired
};

export default SearchBox;
