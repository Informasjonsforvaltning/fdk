import React from 'react';
import PropTypes from 'prop-types';

import CustomHitsStats from '../search-result-custom-hitstats';
import './index.scss';

const SearchBox  = (props) => {
  const { onSearchSubmit, onSearchChange, searchQuery, countDatasets, isFetchingDatasets, countTerms, isFetchingTerms, open } = props;
  return (
    <div className="row mb-60">
      <div className="col-12 col-md-8 col-md-offset-2 fdk-search-flex">
        <div className="visible-sm visible-xs">
          <button
            type="button"
            className="fdk-button-default fdk-button fdk-button-filter btn btn-lg btn-primary"
            onClick={open}
          >
          Filter
          </button>
        </div>
        <div className="fdk-search-box">
          <form onSubmit={(e) => {e.preventDefault(); onSearchSubmit(e.target.value)}}>
            <span className="glyphicon-search-frontpage glyphicon glyphicon-search" />
            <label htmlFor="searchBox">
              <input
                name="searchBox"
                type="search"
                placeholder="Søk etter innhold"
                aria-label="Skriv tekst for søk"
                className="fdk-search"
                value={searchQuery || ''}
                onChange={(e) => {e.preventDefault(); onSearchChange(e)}}
              />
            </label>
          </form>
        </div>
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
}

SearchBox.defaultProps = {

};

SearchBox.propTypes = {

};

export default SearchBox;
