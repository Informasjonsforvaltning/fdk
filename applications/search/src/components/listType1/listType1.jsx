import React from 'react';
import PropTypes from 'prop-types';

export const ListType1 = props => {
  const { title } = props;
  return (
    <section className="mb-5 list-type1" name={title}>
      <div>
        <h3>{title}</h3>
      </div>
      <hr />
      {props.children}
    </section>
  );
};

ListType1.defaultProps = {
  title: null,
  children: null
};

ListType1.propTypes = {
  title: PropTypes.string,
  children: PropTypes.array
};
