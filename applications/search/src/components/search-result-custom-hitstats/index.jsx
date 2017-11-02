import React from 'react'; // const React = require('react');
import qs from 'qs'; // const qs = require('qs');

import localization from '../localization';

const CustomHitsStats = (props) => {
  const { hitsCount, timeTaken } = props;
  const queryObj = qs.parse(window.location.search.substr(1));
  let requestCompleted = true;
  if(timeTaken === window.timeTaken) {
    requestCompleted =  false;
  }
  window.timeTaken = timeTaken;
  const filteringOrTextSearchPerformed = queryObj ? Object.keys(queryObj).length > 1 || (Object.keys(queryObj).length === 1 && !queryObj.lang) : false;
  const hitsCountInt = hitsCount ? parseInt(hitsCount, 10) : 0;

  if (requestCompleted && filteringOrTextSearchPerformed) { // it's a search
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info" data-qa="info">
          <span>{localization.page['result.summary']}</span> <span>{hitsCount}</span> {localization.page.dataset}
        </div>
      </div>
    );
  } else if (requestCompleted && hitsCountInt) {
    return (
      <div className="sk-hits-stats" data-qa="hits-stats">
        <div className="sk-hits-stats__info nosearch" data-qa="info">
          <span>{localization.page['nosearch.summary']}</span> <span>{hitsCount}</span> {localization.page['nosearch.descriptions']}
        </div>
      </div>
    );
  }
  return null;
};

export default CustomHitsStats;
