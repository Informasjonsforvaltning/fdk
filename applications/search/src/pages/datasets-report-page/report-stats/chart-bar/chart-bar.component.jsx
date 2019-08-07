import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Motion, spring } from 'react-motion';

import './chart-bar.scss';

export const ChartBar = props => {
  const { componentKey, percentHeight, barColor } = props;
  const barClass = cx({
    'fdk-bg-color-success-lighter': barColor === 'green',
    'fdk-bg-color-warning-lighter': barColor === 'yellow',
    'fdk-bg-color-danger-lighter': barColor === 'red',
    'fdk-bg-color-neutral-lighter': barColor === 'grey'
  });

  return (
    <ul className="align-items-center stat-box--icon mb-5 pl-0 chart">
      <li>
        <Motion
          key={componentKey}
          defaultStyle={{ height: 0 }}
          style={{ height: spring(percentHeight) }}
        >
          {interpolatingStyle => (
            <span
              className={barClass}
              style={{ height: `${interpolatingStyle.height}%` }}
            />
          )}
        </Motion>
      </li>
    </ul>
  );
};

ChartBar.defaultProps = {
  componentKey: null,
  percentHeight: null,
  barColor: null
};

ChartBar.propTypes = {
  componentKey: PropTypes.string,
  percentHeight: PropTypes.number,
  barColor: PropTypes.oneOf(['green', 'yellow', 'red', 'grey'])
};
