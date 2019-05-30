import React, { useEffect } from 'react';
import { connect } from 'react-redux';

/*
This enhancer is for assigning component a capability to dispatch actions on props change.

changeFilter parameter
  https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect

  Examples:

  - fire only once:
    ()=>[]

  - fire for change on props.id change
    props => [props.match.params.id]

  - default is is to change on any props change
     () => undefined


Complete usage example:

  const dispatcher = (dispatch, props) => {
    dispatch(someAction(props.someProp));
  }

  const changeFilter = props => [props.match.params.id]

  const enhancer = withDispatchOnPropsChange(dispatcher,changeFilter);

  const component=enhancer(componentPure);

 */

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

export const withDispatchOnPropsChange = (
  dispatchOnChange,
  changeFilter
) => Component =>
  connect(
    undefined,
    mapDispatchToProps(dispatchOnChange)
  )(withEffect(changeFilter)(Component));
