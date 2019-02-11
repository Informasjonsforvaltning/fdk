import React from 'react';
import PropTypes from 'prop-types';
import './list-regular.scss';

export const ListRegular = props => {
  const { title, subTitle, bottomMargin, tag: Tag } = props;
  return (
    <section
      className={`list-regular ${bottomMargin ? 'mb-5' : ''}`}
      name={title}
    >
      {title && (
        <div className="list-regular--item">
          <Tag>{title}</Tag>
          {subTitle && <span>{subTitle}</span>}
        </div>
      )}
      {props.children}
    </section>
  );
};

ListRegular.defaultProps = {
  title: null,
  subTitle: null,
  children: null,
  bottomMargin: true,
  tag: 'h2'
};

ListRegular.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  bottomMargin: PropTypes.bool,
  tag: PropTypes.string
};
