import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Scroll from 'react-scroll';

const ScrollLink = Scroll.Link;

export const StickyMenu = props => {
  return (
    <nav className="sticky-menu sticky-top py-5 py-md-4" aria-hidden="true">
      <span className="uu-invisible" aria-hidden="false">Sidemeny for api beskrivelse:</span>
      <ul className="p-0">
        <li className="mb-5">
          <ScrollLink
            className="smoothScroll d-flex justify-content-between"
            to="endpoints" spy smooth isDynamic offset={0} duration={1500}
          >
            <span className="read-more">Endepunkter</span>
          </ScrollLink>
        </li>
        <li className="mb-5">
          <ScrollLink
            className="smoothScroll d-flex justify-content-between"
            to="lorem" spy smooth isDynamic offset={0} duration={1500}
          >
            <span className="read-more">Lorem ipsum</span>
          </ScrollLink>
        </li>
        <li className="mb-5">
          <ScrollLink
            className="smoothScroll d-flex justify-content-between"
            to="lorem" spy smooth isDynamic offset={0} duration={1500}
          >
            <span className="read-more">Lorem ipsum</span>
          </ScrollLink>
        </li>
      </ul>
    </nav>
  );
};

StickyMenu.defaultProps = {
};

StickyMenu.propTypes = {
};
