import React, { useEffect } from 'react';
import { connect } from 'react-redux';

/*
This enhancer is for assigning component a capability to dispatch actions on props change.

dependencies parameter
  https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect

  Examples:

  - dispatch only once (default):
    ()=>[]

  - dispatch on props.id change
    props => [props.match.params.id]

  - dispatch on any props change
     () => undefined


Complete usage example:

  const dispatcher = (dispatch, props) => {
    dispatch(someAction(props.someProp));
  }

  const dependencies = props => [props.match.params.id]

  const enhancer = withDispatchOnPropsChange(dispatcher,dependencies);

  const component=enhancer(componentPure);

 */

// by default launch effect only once
// override with array returning function,
// for example:  props=>[props.datasetId]
const defaultDependencies = () => [];

const withEffect = dependencies => Component => props => {
  const dependenciesFn =
    typeof dependencies === 'function' ? dependencies : defaultDependencies;
  useEffect(
    props.dispatchOnEffect, // eslint-disable-line react/prop-types
    dependenciesFn(props)
  );
  return <Component {...props} />;
};

const mapDispatchToProps = dispatchOnChange => (dispatch, ownProps) => ({
  dispatchOnEffect: () => dispatchOnChange(dispatch, ownProps)
});

export const withDispatchOnPropsChange = (
  dispatchOnChange,
  changeFilter
) => Component =>
  connect(
    undefined,
    mapDispatchToProps(dispatchOnChange)
  )(withEffect(changeFilter)(Component));
