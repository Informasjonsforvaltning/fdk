const qs = require('qs');
export const CustomHitStats = (props) => {
    const {resultsFoundLabel, bemBlocks, hitsCount, timeTaken} = props;
      let queryObj = qs.parse(window.location.search.substr(1));
        if(queryObj && Object.keys(queryObj).length > 1 || Object.keys(queryObj).length === 1 && !queryObj.lang) { // it's a search
          return (
            <div className="sk-hits-stats" data-qa="hits-stats">
              <div className="sk-hits-stats__info" data-qa="info">
                {localization.page['result.summary']} {hitsCount} {localization.page.dataset}
              </div>
            </div>
          )
        } else {
          return (
              <div className="sk-hits-stats" data-qa="hits-stats">
                <div className="sk-hits-stats__info" data-qa="info">
                  {localization.page['nosearch.summary']}
                </div>
              </div>
          )
        }
      }
}
