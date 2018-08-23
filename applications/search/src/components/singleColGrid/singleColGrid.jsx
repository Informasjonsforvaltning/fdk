import React from 'react';
import PropTypes from 'prop-types';

const renderItems = items =>
  items &&
  items.map((item, index) => (
    <React.Fragment key={index}>
      {index > 0 ? '<hr />' : ''}
      <div>
        <span>{item}</span>
      </div>
    </React.Fragment>
  ));

export const SingleColGrid = props => {
  const { title, items } = props;
  return (
    <section className="mb-5 list-type1" name={title}>
      <div>
        <h3>{title}</h3>
      </div>
      <hr />
      {renderItems(items)}
    </section>
  );
};

SingleColGrid.defaultProps = {
  title: null
};

SingleColGrid.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array.isRequired
};
