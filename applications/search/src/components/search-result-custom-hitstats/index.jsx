const qs = require('qs');
const React = require('react');

import localization from '../localization';

export const CustomHitsStats = (props) => {
  const {resultsFoundLabel, bemBlocks, hitsCount, timeTaken} = props;
  let queryObj = qs.parse(window.location.search.substr(1));
  let requestCompleted = timeTaken > 0;
  let filteringOrTextSearchPerformed = queryObj ? Object.keys(queryObj).length > 1 || (Object.keys(queryObj).length === 1 && !queryObj.lang) : false;
  let hitsCountInt = hitsCount ? parseInt(hitsCount) : 0;
  if(requestCompleted && filteringOrTextSearchPerformed) { // it's a search
      return (
        <div className="sk-hits-stats" data-qa="hits-stats">
          <div className="sk-hits-stats__info" data-qa="info">
            <span>{localization.page['result.summary']}</span> <span>{hitsCount}</span> {localization.page.dataset}
          </div>
        </div>
      )
  } else if(requestCompleted && hitsCountInt) {
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info" data-qa="info">
          <span>{localization.page['nosearch.summary']}</span> <span>{hitsCount}</span> {localization.page['nosearch.descriptions']}
        </div>
      </div>
    )
  } else {
    return null
  }
}
