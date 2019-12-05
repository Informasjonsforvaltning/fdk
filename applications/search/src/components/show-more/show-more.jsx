import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStateHandlers } from 'recompose';
import cx from 'classnames';

import localization from '../../lib/localization';
import './show-more.scss';

function convertRemToPixels(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// set to match limiting block height in show-more.css
const COLLAPSE_THRESHOLD = convertRemToPixels(12);

export const ShowMorePure = ({
  showMoreButtonText,
  showLessButtonText,
  toggleShowAll,
  contentHeight,
  showAll,
  setContentHeight,
  children
}) => {
  function onRef(element) {
    if (element && !contentHeight) {
      setContentHeight(element.getBoundingClientRect().height);
    }
  }
  function _renderContent(extraClass) {
    return (
      <div className={cx('fdk-ingress', extraClass)} ref={onRef}>
        {children}
      </div>
    );
  }
  let content;
  if (!contentHeight) {
    // content height not measured, render with measuring box
    content = _renderContent('show-more__cropped-box-measure');
  } else if (contentHeight < COLLAPSE_THRESHOLD) {
    // content height is under threshold
    content = _renderContent();
  } else if (showAll) {
    // content height is over threshold, uncollapsed view
    content = (
      <>
        {_renderContent()}
        <button
          type="button"
          className="fdk-button-small"
          onClick={toggleShowAll}
        >
          <i className="fa mr-2 fa-angle-double-up" />
          <span>{showLessButtonText || localization.showLess}</span>
        </button>
      </>
    );
  } else {
    // content height is over threshold, collapsed view
    content = (
      <>
        {_renderContent('show-more__cropped-box')}
        <button
          type="button"
          className="fdk-button-small"
          onClick={toggleShowAll}
        >
          <i className="fa mr-2 fa-angle-double-down" />
          <span>{showMoreButtonText || localization.showMore}</span>
        </button>
      </>
    );
  }
  return <div className="mb-5">{content}</div>;
};

ShowMorePure.defaultProps = {
  showMoreButtonText: '',
  showLessButtonText: '',
  toggleShowAll: _.noop,
  setContentHeight: _.noop,
  showAll: false
};

ShowMorePure.propTypes = {
  showMoreButtonText: PropTypes.string,
  showLessButtonText: PropTypes.string,
  toggleShowAll: PropTypes.func,
  setContentHeight: PropTypes.func,
  showAll: PropTypes.bool
};

const enhance = withStateHandlers(
  ({ initialShowAll = false, initialContentHeight = null }) => ({
    showAll: initialShowAll,
    contentHeight: initialContentHeight
  }),
  {
    toggleShowAll: ({ showAll }) => () => ({ showAll: !showAll }),
    setContentHeight: () => value => ({ contentHeight: value })
  }
);

export const ShowMoreWithState = enhance(ShowMorePure);
export const ShowMore = ShowMoreWithState;
