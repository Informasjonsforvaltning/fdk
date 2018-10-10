import React from 'react';
import PropTypes from 'prop-types';

export const ListRegularItem = props => {
  const { asideContent, mainContent } = props;
  return (
    <div className="d-flex list-regular--item">
      <div className="col-4 pl-0 fdk-text-strong">{asideContent}</div>
      <div className="col-8">{mainContent}</div>
    </div>
  );
};

ListRegularItem.defaultProps = {
  asideContent: null,
  mainContent: null
};

ListRegularItem.propTypes = {
  asideContent: PropTypes.string,
  mainContent: PropTypes.string
};
