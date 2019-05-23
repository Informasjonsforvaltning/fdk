import React from 'react';

// default props mapper merges all properties from the context value to child component
const defaultPropsMapper = value => value;

// own props take precedence over props merged from context
export const withContextConsumer = (
  Context,
  propsMapper
) => WrappedComponent => props => (
  <Context.Consumer>
    {contextValue => (
      <WrappedComponent
        {...(propsMapper || defaultPropsMapper)(contextValue)}
        {...props}
      />
    )}
  </Context.Consumer>
);
