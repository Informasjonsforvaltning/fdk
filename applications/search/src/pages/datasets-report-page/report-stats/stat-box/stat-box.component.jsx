import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import PieChart from 'react-minimal-pie-chart';
import { Motion, spring } from 'react-motion';

import './stat-box.scss';

const config = { stiffness: 100, damping: 10 };
const toCSS = scale => ({ transform: `scale3d(${scale}, ${scale}, ${scale})` });

export const StatBox = props => {
  const {
    componentKey,
    statBoxStyle,
    iconBgSize,
    iconBgColor,
    iconType,
    iconColor,
    label,
    children,
    pieData
  } = props;

  const statBoxClass = cx(
    'd-flex',
    'flex-fill',
    'flex-column',
    'align-items-center',
    'p-4',
    'statbox',
    statBoxStyle
  );

  const statBoxCircle = cx(
    'd-flex',
    'justify-content-center',
    'align-items-center',
    {
      'stat-box-circle--xlarge': iconBgSize === 'xlarge',
      'stat-box-circle--large': iconBgSize === 'large',
      'stat-box-circle--medium': iconBgSize === 'medium',
      'stat-box-circle--small': iconBgSize === 'small',
      'fdk-bg-color-green-2': iconBgColor === 'green',
      'fdk-bg-color-yellow-2': iconBgColor === 'yellow',
      'fdk-bg-color-red-2': iconBgColor === 'red',
      'fdk-bg-color-grey-2': iconBgColor === 'grey',
      'fdk-color-green-1': iconColor === 'green',
      'fdk-color-yellow-1': iconColor === 'yellow',
      'fdk-color-red-1': iconColor === 'red',
      'fdk-color-blue': iconColor === 'blue',
      'fdk-color-grey-1': iconColor === 'grey'
    }
  );

  const statBoxIcon = cx('fa fa-2x', {
    [`fa-${iconType}`]: true
  });

  return (
    <div className={statBoxClass}>
      {iconType && (
        <div className="d-flex align-items-center stat-box--icon mb-5">
          <Motion
            key={componentKey}
            defaultStyle={{ scale: 0 }}
            style={{ scale: spring(1, config) }}
          >
            {interpolatingStyle => (
              <div
                className={statBoxCircle}
                style={toCSS(interpolatingStyle.scale)}
              >
                <i className={statBoxIcon} />
              </div>
            )}
          </Motion>
        </div>
      )}
      {pieData && (
        <div className="d-flex align-items-center stat-box--icon mb-5">
          <PieChart
            className={statBoxCircle}
            data={pieData}
            startAngle={0}
            lineWidth={45}
            animate
            style={{ height: '12rem' }}
          />
        </div>
      )}
      {children}
      <span className="text-center">{label}</span>
    </div>
  );
};

StatBox.defaultProps = {
  componentKey: null,
  statBoxStyle: null,
  iconBgSize: null,
  iconBgColor: null,
  iconType: null,
  iconColor: null,
  label: null,
  children: null,
  pieData: null
};

StatBox.propTypes = {
  componentKey: PropTypes.string,
  statBoxStyle: PropTypes.string,
  iconBgSize: PropTypes.oneOf(['xlarge', 'large', 'medium', 'small']),
  iconBgColor: PropTypes.oneOf(['green', 'yellow', 'red', 'grey']),
  iconType: PropTypes.string,
  iconColor: PropTypes.oneOf(['green', 'yellow', 'red', 'blue', 'grey']),
  label: PropTypes.string,
  children: PropTypes.node,
  pieData: PropTypes.array
};
