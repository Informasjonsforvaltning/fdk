import React, { useEffect } from 'react';
import { connect } from 'react-redux';

// by default launch effect on every props change
// override with array returning function,
// for example:  (props)=>[props.datasetId]
const defaultChangeInputs = () => undefined;

const withEffect = changeInputs => Component => props => {
  useEffect(
    props.dispatchOnEffect, // eslint-disable-line react/prop-types
    (changeInputs || defaultChangeInputs)(props)
  );
  return <Component {...props} />;
};

const mapDispatchToProps = dispatchOnChange => (dispatch, ownProps) => ({
  dispatchOnEffect: () => dispatchOnChange(dispatch, ownProps)
});

export const withDispatchOnChange = (
  dispatchOnChange,
  changeInputs
) => Component =>
  connect(
    undefined,
    mapDispatchToProps(dispatchOnChange)
  )(withEffect(changeInputs)(Component));
