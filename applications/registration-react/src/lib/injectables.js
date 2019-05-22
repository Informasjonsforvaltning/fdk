import React from 'react';
import _ from 'lodash';

import { withContextConsumer } from './with-context-consumer';

export const InjectablesContext = React.createContext(null);

export const withInjectablesMapper = propsMapper =>
  withContextConsumer(InjectablesContext, propsMapper);

export const withInjectables = selectedInjectables =>
  withInjectablesMapper(injectables =>
    _.pick(injectables, selectedInjectables)
  );
