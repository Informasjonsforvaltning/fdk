import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStateHandlers } from 'recompose';

import localization from '../../lib/localization';
import './show-more.scss';

export const ShowMorePure = ({
  showMoreButtonText,
  showLessButtonText,
  toggleShowAll,
  showAll,
  contentHtml,
  children
}) => {
  function _renderContent() {
    return (
      <span className="fdk-ingress">
        {children}
        <span
          dangerouslySetInnerHTML={{
            __html: contentHtml
          }}
        />
      </span>
    );
  }
  const textLength = contentHtml.length;
  const COLLAPSE_THRESHOLD = 300;
  let content;

  if (textLength < COLLAPSE_THRESHOLD) {
    content = _renderContent();
  } else if (!showAll) {
    content = (
      <React.Fragment>
        <div className="show-more__cropped-box">{_renderContent()}</div>
        <button className="fdk-button-small" onClick={toggleShowAll}>
          <i className="fa mr-2 fa-angle-double-down" />
          <span>{showMoreButtonText}</span>
        </button>
      </React.Fragment>
    );
  } else if (showAll) {
    content = (
      <React.Fragment>
        <div>{_renderContent()}</div>
        <button className="fdk-button-small" onClick={toggleShowAll}>
          <i className="fa mr-2 fa-angle-double-up" />
          <span>{showLessButtonText}</span>
        </button>
      </React.Fragment>
    );
  }
  return <div className="mb-5">{content}</div>;
};

ShowMorePure.defaultProps = {
  contentHtml: '',
  showMoreButtonText: localization.showLess,
  showLessButtonText: localization.showLess,
  toggleShowAll: _.noop,
  showAll: false
};

ShowMorePure.propTypes = {
  contentHtml: PropTypes.string,
  showMoreButtonText: PropTypes.string,
  showLessButtonText: PropTypes.string,
  toggleShowAll: PropTypes.func,
  showAll: PropTypes.bool
};

const enhance = withStateHandlers(
  ({ initialShowAll = false }) => ({ showAll: initialShowAll }),
  {
    toggleShowAll: ({ showAll }) => () => ({ showAll: !showAll })
  }
);

export const ShowMoreWithState = enhance(ShowMorePure);
export const ShowMore = ShowMoreWithState;
