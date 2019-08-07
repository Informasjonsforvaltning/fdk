import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import './sticky-menu.scss';

const ScrollLink = Scroll.Link;

const renderMenuItem = menuItem => (
  <li className="border-top py-3" key={menuItem.name}>
    <ScrollLink
      className="smoothScroll d-flex justify-content-between"
      to={menuItem.name}
      spy
      smooth
      isDynamic
      offset={0}
      duration={1500}
    >
      <span>{menuItem.prefLabel}</span>
    </ScrollLink>
  </li>
);

const renderMenu = menuItems =>
  menuItems && (
    <ul className="p-0">
      {menuItems.map(menuItem => renderMenuItem(menuItem))}
    </ul>
  );

export const StickyMenu = ({ title, menuItems }) => (
  <nav className="sticky-menu sticky-top py-5 py-md-4" aria-hidden="true">
    <span className="uu-invisible" aria-hidden="false">
      Sidemeny:
    </span>
    {title && <h3 className="pb-3">{title}</h3>}
    {renderMenu(menuItems)}
  </nav>
);

StickyMenu.defaultProps = {
  title: null,
  menuItems: null
};

StickyMenu.propTypes = {
  title: PropTypes.string,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      prefLabel: PropTypes.string.isRequired
    })
  )
};
